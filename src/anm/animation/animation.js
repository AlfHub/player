var utils = require('../utils.js'),
    is = utils.is,
    iter = utils.iter,
    C = require('../constants.js');

var engine = require('engine'),
    ResMan = require('../resource_manager.js'),
    FontDetector = require('../../vendor/font_detector.js');

var Element = require('./element.js'),
    Clip = Element,
    Brush = require('../graphics/brush.js');

var events = require('../events.js'),
    provideEvents = events.provideEvents,
    errors = require('../errors.js'),
    ErrLoc = require('../loc.js').Errors;

var Search = require('./search.js');

/* X_ERROR, X_FOCUS, X_RESIZE, X_SELECT, touch events */

var DOM_TO_EVT_MAP = {
    'click':     C.X_MCLICK,
    'dblclick':  C.X_MDCLICK,
    'mouseup':   C.X_MUP,
    'mousedown': C.X_MDOWN,
    'mousemove': C.X_MMOVE,
    'mouseover': C.X_MOVER,
    'mouseout':  C.X_MOUT,
    'keypress':  C.X_KPRESS,
    'keyup':     C.X_KUP,
    'keydown':   C.X_KDOWN
};

// Animation
// -----------------------------------------------------------------------------

/**
 * @class anm.Animation
 *
 * Create an Animation.
 *
 * It holds an elements tree, an id-to-element map, background fill, zoom and
 * repeat option. It also may render itself to any context with {@link anm.Animation#render}
 * method.
 *
 * Use {@link anm.Animation#add} to add elements to an animation.
 *
 * Use {@link anm.Animation#find} / {@link anm.Animation#findById} to search for elements in the animation.
 *
 * Use {@link anm.Animation#each} / {@link anm.Animation#traverse} to loop through all direct child elements
 * or through the whole tree of children, correspondingly.
 *
 * See {@link anm.Element Element} for detailed description of the basic "brick" of any animation.
 *
 * @constructor
 */
function Animation() {
    this.id = utils.guid();
    this.tree = [];
    this.hash = {};
    this.name = '';
    this.duration = undefined;
    this.bgfill = null;
    this.width = undefined;
    this.height = undefined;
    this.zoom = 1.0;
    this.speed = 1.0;
    this.factor = 1.0;
    this.repeat = false;
    this.meta = {};
    this.targets = {}; // Player instances where this animation was loaded, by ID
    this.$prefix = null; // functions to call before every frame
    //this.fps = undefined;
    this.__informEnabled = true;
    this.__lastOverElm = null;
    this._laters = [];
    this._initHandlers(); // TODO: make automatic
}

Animation.DEFAULT_DURATION = 10;

provideEvents(Animation, [ C.A_START, C.A_PAUSE, C.A_STOP,
                           C.X_MCLICK, C.X_MDCLICK, C.X_MUP, C.X_MDOWN,
                           C.X_MMOVE, C.X_MOVER, C.X_MOUT,
                           C.X_KPRESS, C.X_KUP, C.X_KDOWN, C.X_ERROR ]);
/**
 * @method add
 * @chainable
 *
 * Append one or several {@link anm.Element elements} to this animation.
 *
 * May be used as:
 *
 * * `anim.add(new anm.Element());`
 * * `anim.add([new anm.Element(), new anm.Element()]);`
 * * `anim.add(function(ctx) {...}, function(t) { ... });`
 * * `anim.add(function(ctx) {...}, function(t) { ... },
 *           function(ctx, prev(ctx)) { ... });`
 *
 * @param {anm.Element|anm.Clip|Array[Element]} subject Any number of Elements to add
 *
 * @return {anm.Element} The Element was appended.
 *
 */
Animation.prototype.add = function(arg1, arg2, arg3) {
    // this method only adds an element to a top-level
    // FIXME: allow to add elements deeper or rename this
    //        method to avoid confusion?
    if (arg2) { // element by functions mode
        var elm = new Element(arg1, arg2);
        if (arg3) elm.changeTransform(arg3);
        this.addToTree(elm);
        //return elm;
    } else if (is.arr(arg1)) { // elements array mode
        var clip = new Clip();
        clip.add(arg1);
        this.addToTree(_clip);
        //return clip;
    } else { // element object mode
        this.addToTree(arg1);
    }
    return this;
};

/**
 * @method remove
 * @chainable
 *
 * Remove (unregister) element from this animation.
 *
 * @param {anm.Element} element
 */
Animation.prototype.remove = function(elm) {
    // error will be thrown in _unregister method if element is not registered
    if (elm.parent) {
        // it will unregister element inside
        elm.parent.remove(elm);
    } else {
        this._unregister(elm);
    }
    return this;
};

/**
 * @method traverse
 * @chainable
 *
 * Visit every element in a tree, no matter how deep it is.
 *
 * @param {Function} visitor
 * @param {anm.Element} visitor.element
 * @param {Boolean} visitor.return if `false` returned, stops the iteration. no-`return` or empty `return` both considered `true`.
 * @param {Object} [data]
 */
Animation.prototype.traverse = function(visitor, data) {
    utils.keys(this.hash, function(key, elm) { return visitor(elm, data); });
    return this;
};

/**
 * @method each
 * @chainable
 *
 * Visit every root element (direct Animation child) in a tree.
 *
 * @param {Function} visitor
 * @param {anm.Element} visitor.child
 * @param {Boolean} visitor.return if `false` returned, stops the iteration. no-`return` or empty `return` both considered `true`.
 * @param {Object} [data]
 */
Animation.prototype.each = function(visitor, data) {
    for (var i = 0, tlen = this.tree.length; i < tlen; i++) {
        if (visitor(this.tree[i], data) === false) break;
    }
    return this;
};

/**
 * @method reverseEach
 * @chainable
 *
 * Visit every root element (direct Animation child) in a tree. The only difference
 * with {@link anm.Animation#each .each} is that `.reverseEach` literally iterates
 * over the children in the order _reverse_ to the order of their addition—this
 * could be helpful when you need elements with higher z-index to be visited before.
 *
 * @param {Function} visitor
 * @param {anm.Element} visitor.child
 * @param {Boolean} visitor.return if `false` returned, stops the iteration. no-`return` or empty `return` both considered `true`.
 * @param {Object} [data]
 */
Animation.prototype.reverseEach = function(visitor, data) {
    var i = this.tree.length;
    while (i--) {
        if (visitor(this.tree[i], data) === false) break;
    }
    return this;
};

/**
 * @method iter
 * @chainable
 *
 * Iterate through every root (direct Animation child) element in a tree.
 *
 * @param {Function} iterator
 * @param {anm.Element} iterator.child
 * @param {Boolean} iterator.return if `false` returned, stops the iteration. no-`return` or empty `return` both considered `true`.
 * @param {Function} [remover]
 * @param {anm.Element} remover.child
 * @param {Boolean} remover.return `false`, if this element should be removed
 */
Animation.prototype.iter = function(func, rfunc) {
    iter(this.tree).each(func, rfunc);
    return this;
};

/**
 * @method render
 *
 * Render the Animation for given context at given time.
 *
 * @param {Canvas2DContext} context
 * @param {Number} time
 * @param {Number} [dt] The difference in time between current frame and previous one
 */
Animation.prototype.render = function(ctx, time, dt) {
    ctx.save();
    this.time = time;
    var zoom = this.zoom;
    if (zoom != 1) {
        ctx.scale(zoom, zoom);
    }
    if (this.bgfill) {
        if (!(this.bgfill instanceof Brush)) this.bgfill = Brush.fill(this.bgfill);
        this.bgfill.apply(ctx);
        ctx.fillRect(0, 0, this.width, this.height);
    }
    time = this.$prefix ? this.$prefix(time, ctx) : time;
    this.each(function(child) {
        child.render(ctx, time, dt);
    });
    ctx.restore();
};

/**
 * @method jump
 *
 * Jump to the given time in animation. Currently calls a {@link anm.Player#seek player.seek} for
 * every Player where this animation was loaded inside. It will skip a jump, if it's already in process
 * of jumping.
 *
 * @param {Number} time
 */
Animation.prototype.jump = function(t) {
    if (this.jumping) return;
    this.jumping = true;
    utils.keys(this.targets, function(id, player) {
        if (player) player.seek(t);
    });
    this.jumping = false;
};

/**
 * @method jumpTo
 *
 * Jump to the given start time of the element given or found with passed selector (uses
 * {@link anm.Animation#jumpTo animation.jumpTo} inside). It will skip a jump, if it's already in process
 * of jumping.
 *
 * @param {String|anm.Element} selector
 */
Animation.prototype.jumpTo = function(selector) {
    var elm = is.str(selector) ? this.find(selector) : selector;
    if (!elm) return;
    this.jump(elm.gband[0]);
};

// TODO: test
/**
 * @method getFittingDuration
 *
 * Get the duration where all child elements' bands fit.
 *
 * @return {Number} The calculated duration
 */
Animation.prototype.getFittingDuration = function() {
    var max_pos = -Infinity;
    var me = this;
    this.each(function(child) {
        var elm_tpos = child._max_tpos();
        if (elm_tpos > max_pos) max_pos = elm_tpos;
    });
    return max_pos;
};

/**
 * @method reset
 * @chainable
 *
 * Reset all render-related data for itself, and the data of all the elements.
 */
Animation.prototype.reset = function() {
    this.__informEnabled = true;
    this.time = null;
    this.each(function(child) {
        child.reset();
    });
    return this;
};

/**
 * @method playedIn
 * @param {anm.Player} player the Player where animation was loaded to
 * @chainable
 *
 * See also {@link anm.Animation#dispose animation.dispose}.
 *
 * Remembers that this Animation is loaded in this Player instance, so
 * passes calls, like time jump requests, to it. Called automatically
 * when Animation was loaded into some Player.
 */
Animation.prototype.playedIn = function(player) {
    this.targets[player.id] = player;
    return this;
}

/**
 * @method dispose
 * @param {anm.Player} [player] the Player which disposes this animation.
 * @chainable
 *
 * Remove every possible allocated data to either never use this animation again or
 * start using it from scratch as if it never was used before. If Player instance was
 * passed, Animation also forgets it was played in this Player, so different calls,
 * like time jumps, fired from the Animation won't be passed to it. Called automatically
 * when Animation needs to be detached from some Player.
 */
Animation.prototype.dispose = function(player) {
    if (player) this.targets[player.id] = null;
    this.disposeHandlers();
    var me = this;
    /* FIXME: unregistering removes from tree, ensure it is safe */
    this.iter(function(child) {
        me._unregister_no_rm(child);
        child.dispose();
        return false;
    });
    return this;
};

/**
 * @method isEmpty
 *
 * Does Animation has any Elements inside.
 *
 * @return {Boolean} `true` if no Elements, `false` if there are some.
 */
Animation.prototype.isEmpty = function() {
    return this.tree.length === 0;
};

/**
 * @method toString
 *
 * Get a pretty description of this Animation
 *
 * @return {String} pretty string
 */
Animation.prototype.toString = function() {
    return "[ Animation "+(this.name ? "'"+this.name+"'" : "")+"]";
};

/**
 * @method subscribeEvents
 * @private
 *
 * @param {Canvas} canvas
 */
Animation.prototype.subscribeEvents = function(canvas) {
    engine.subscribeAnimationToEvents(canvas, this, DOM_TO_EVT_MAP);
};

/**
 * @method unsubscribeEvents
 * @private
 *
 * @param {Canvas} canvas
 */
Animation.prototype.unsubscribeEvents = function(canvas) {
    engine.unsubscribeAnimationFromEvents(canvas, this);
};

// this function is called for any event fired for this element, just before
// passing it to the handlers; if this function returns `true` or nothing, the event is
// then passed to all the handlers; if it returns `false`, handlers never get this event.
Animation.prototype.filterEvent = function(type, evt) {

    function firstSubscriber(elm, type) {
        return elm.firstParent(function(parent) {
            return parent.subscribedTo(type);
        });
    }

    var anim = this;
    if (events.mouse(type)) {
        var pos = anim.adapt(evt.pos.x, evt.pos.y);
        var targetFound = false;
        anim.reverseEach(function(child) {
            child.inside(pos, function(elm) { // filter elements
                return is.defined(elm.cur_t) && elm.fits(elm.cur_t);
            }, function(elm, local_pos) { // point is inside
                targetFound = true;
                if (type !== 'mousemove') {
                    var subscriber = firstSubscriber(elm, type);
                    if (subscriber) subscriber.fire(type, evt);
                } else { // type === 'mousemove'
                    // check mouseover/mouseout
                    var mmoveSubscriber = firstSubscriber(elm, 'mousemove');
                    if (!anim.__lastOverElm) {
                        // mouse moved over some element for the first time
                        anim.__lastOverElm = elm;
                        var moverSubscriber = firstSubscriber(elm, 'mouseover');
                        if (moverSubscriber) moverSubscriber.fire('mouseover', evt);
                        if (mmoveSubscriber) mmoveSubscriber.fire('mousemove', evt); // fire this mousemove next to mouseover
                    } else {
                        if (elm.id === anim.__lastOverElm.id) { // mouse is still over this element
                            if (mmoveSubscriber) mmoveSubscriber.fire(type, evt);
                        } else {
                            // mouse moved over new element
                            var moverSubscriber = firstSubscriber(elm, 'mouseover');
                            if (anim.__lastOverElm) {
                                var moutSubscriber = firstSubscriber(anim.__lastOverElm, 'mouseout');
                                if (moutSubscriber) moutSubscriber.fire('mouseout', evt);
                                anim.__lastOverElm = null;
                            }
                            anim.__lastOverElm = elm;
                            if (moverSubscriber) moverSubscriber.fire('mouseover', evt);
                            if (mmoveSubscriber) mmoveSubscriber.fire('mousemove', evt); // fire this mousemove next to mouseover
                        }
                    }

                }
                return false; /* stop inner iteration, so first matched element exits the check */
            });
            if (targetFound) return false; /* stop outer iteration, so first matched element exits the check */
        });
        if ((type === 'mousemove') && !targetFound && anim.__lastOverElm) {
            var stillInside = false;
            anim.__lastOverElm.inside(pos, null, function() { stillInside = true; });
            if (!stillInside) {
                var moutSubscriber = firstSubscriber(anim.__lastOverElm, 'mouseout');
                anim.__lastOverElm = null;
                if (moutSubscriber) moutSubscriber.fire('mouseout', evt);
            }
        }
        return false; /* stop passing this event further to other handlers */
    }
    return true; /* keep passing this event further to other handlers */
};

/**
 * @method addToTree
 * @private
 *
 * @param {anm.Element} element
 */
Animation.prototype.addToTree = function(elm) {
    if (!elm.children) throw errors.animation(ErrLoc.A.OBJECT_IS_NOT_ELEMENT, this);
    this._register(elm);
    /*if (elm.children) this._addElems(elm.children);*/
    this.tree.push(elm);
};

Animation.prototype.handlePause = function() {
    this.traverse(function(elm) {
        elm.__resetBandEvents();
    });
};

/*Animation.prototype._addElems = function(elems) {
    for (var ei = 0; ei < elems.length; ei++) {
        var _elm = elems[ei];
        this._register(_elm);
    }
}*/
Animation.prototype._register = function(elm) {
    if (this.hash[elm.id]) throw errors.animation(ErrLoc.A.ELEMENT_IS_REGISTERED, this);
    elm.registered = true;
    elm.anim = this;
    this.hash[elm.id] = elm;

    var me = this;

    elm.each(function(child) {
        me._register(child);
    });
};

Animation.prototype._unregister_no_rm = function(elm) {
    this._unregister(elm, true);
};

Animation.prototype._unregister = function(elm, save_in_tree) { // save_in_tree is optional and false by default
    if (!elm.registered) throw errors.animation(ErrLoc.A.ELEMENT_IS_NOT_REGISTERED, this);
    var me = this;
    elm.each(function(child) {
        me._unregister(child);
    });
    var pos = -1;
    if (!save_in_tree) {
      while ((pos = this.tree.indexOf(elm)) >= 0) {
        this.tree.splice(pos, 1); // FIXME: why it does not goes deeply in the tree?
      }
    }
    delete this.hash[elm.id];
    elm.registered = false;
    elm.anim = null;
    //elm.parent = null;
};

Animation.prototype._collectRemoteResources = function(player) {
    var remotes = [],
        anim = this;
    this.traverse(function(elm) {
        if (elm._hasRemoteResources(anim, player)) {
           remotes = remotes.concat(elm._collectRemoteResources(anim, player)/* || []*/);
        }
    });
    if(this.fonts && this.fonts.length) {
        remotes = remotes.concat(this.fonts.map(function(f){return f.url;}));
    }
    return remotes;
};

Animation.prototype._loadRemoteResources = function(player) {
    var anim = this;
    this.traverse(function(elm) {
        if (elm._hasRemoteResources(anim, player)) {
           elm._loadRemoteResources(anim, player);
        }
    });
    anim.loadFonts(player);
};

/**
 * @method find
 *
 * Searches for an {@link anm.Element element} by name through another {@link anm.Element element}'s
 * children, or through all the elements in the Animation itself, if no other element was provided.
 *
 * You may specify just a name or a full path, if you start it from slash: `/root/sub-element/search-for`.
 * This way search will ensure element is located exactly at this path and also will visit only the matching elements.
 * You may specify index instead of name at any place in a full path, by preceding it with semicolon symbol:
 * `/root/:2/:3`. You may freely mix both indexes and names in one path.
 *
 * See also: {@link anm.Animation#findAll}, {@link anm.Animation#findById}
 *
 * @param {String} name Name of the element(s) to find or a path
 * @param {anm.Element} [where] Where to search elements for; if omitted, searches in Animation
 *
 * @return {anm.Element} First found element
 */
Animation.prototype.find = function(selector, where) {
    return Search.one(selector).over(where ? where.children : this.tree);
};

/**
 * @method findAll
 *
 * Searches for {@link anm.Element elements} by name through another {@link anm.Element element}'s
 * children, or through all the elements in the Animation itself, if no other element was provided.
 *
 * You may specify just a name or a full path, if you start it from slash: `/root/sub-element/search-for`.
 * This way search will ensure elements are located exactly at this path.
 * You may specify index instead of name at any place in a full path, by preceding it with semicolon symbol:
 * `/root/:2/:3`. You may freely mix both indexes and names in one path.
 *
 * See also: {@link anm.Animation#find}, {@link anm.Animation#findById}
 *
 * @param {String} name Name of the element(s) to find or a path
 * @param {anm.Element} [where] Where to search elements for; if omitted, searches in Animation
 *
 * @return {Array} An array of found elements
 */
Animation.prototype.findAll = function(selector, where) {
    return Search.all(selector).over(where ? where.children : this.tree);
};

/**
 * @method findById
 *
 * Searches for {@link anm.Element elements} by ID inside another inside the
 * Animation. Actually, just gets it from hash map, so O(1).
 *
 * See also: {@link anm.Animation#find}, {@link anm.Animation#findAll}
 *
 * @param {String} id ID of the element to find
 * @return {anm.Element|Null} An element you've searched for, or null
 *
 * @deprecated in favor of special syntax in `find` method
 */
Animation.prototype.findById = function(id) {
    return this.hash[id];
};

/**
 * @method prefix
 *
 * Perform the function exactly before rendering all the elements inside,
 * before the new frame, but after the preparations. This function *should*
 * return the time value passed in or a new time value.
 *
 * @param {Function} f function to call
 * @param {Number} f.t time
 * @param {Context2D} f.ctx canvas context
 * @param {Number} f.return new time value
 */
Animation.prototype.prefix = function(f) {
    this.$prefix = f;
};

/**
 * @method adapt
 *
 * Adapt a point to animation's coordinate space. This has sense only during
 * the the rendering cycle (i.e. in elements' handlers, painters or modifiers),
 * since considers player zoom, animation zoom and other factors re-calculated
 * before the actual rendering of every frame.
 *
 * For example, this method is used in animation' mouse handlers to get the point
 * adapted to player & animation.
 *
 * @param {Number} x
 * @param {Number} y
 *
 * @return {Object} transformed point
 */
Animation.prototype.adapt = function(x, y) {
    return { x: x / this.factor,
             y: y / this.factor };
};

/*
 * @method invokeAllLaters
 * @private
 */
Animation.prototype.invokeAllLaters = function() {
    for (var i = 0; i < this._laters.length; i++) {
        this._laters[i].call(this);
    }
};

/*
 * @method clearAllLaters
 * @private
 */
Animation.prototype.clearAllLaters = function() {
    this._laters = [];
};

/*
 * @method invokeLater
 * @private
 */
Animation.prototype.invokeLater = function(f) {
    this._laters.push(f);
};

var FONT_LOAD_TIMEOUT = 10000; //in ms

/*
 * @method loadFonts
 * @private
 */
Animation.prototype.loadFonts = function(player) {
    if (!this.fonts || !this.fonts.length) {
        return;
    }

    var fonts = this.fonts,
        style = engine.getWebfontStyleObject(),
        css = '',
        fontsToLoad = [],
        detector = new FontDetector();

    for (var i = 0; i < fonts.length; i++) {
        var font = fonts[i];
        if (!font.url || !font.face) {
            //no font name or url
            continue;
        }
        var url = engine.checkMediaUrl(font.url),
            woff = engine.checkMediaUrl(font.woff);
        fontsToLoad.push(font);
        css += '@font-face {\n' +
            'font-family: "' + font.face + '";\n' +
            'src:' +  (woff ? ' url("'+woff+'") format("woff"),\n' : '') +
            ' url("'+url+'") format("truetype");\n' +
            (font.style ? 'font-style: ' + font.style +';\n' : '') +
            (font.weight ? 'font-weight: ' + font.weight + ';\n' : '') +
            '}\n';
    }

    if (fontsToLoad.length === 0) {
        return;
    }

    style.innerHTML += css;

    var getLoader = function(i) {
            var font = fontsToLoad[i];
            return function(success) {
                var interval = 100,
                counter = 0,
                intervalId,
                checkLoaded = function() {
                    counter += interval;
                    var loaded = detector.detect(font);
                    if (loaded || counter > FONT_LOAD_TIMEOUT) {
                        // after 10 seconds, we'll just assume the font has been loaded
                        // and carry on. this should help when the font could not be
                        // reached for whatever reason.
                        clearInterval(intervalId);
                        success();
                    }
                };
                intervalId = setInterval(checkLoaded, interval);
            };
    };

    for (i = 0; i < fontsToLoad.length; i++) {
        ResMan.loadOrGet(player.id, fontsToLoad[i].url, getLoader(i));
    }

};

module.exports = Animation;
