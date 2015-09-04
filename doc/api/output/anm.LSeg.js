Ext.data.JsonP.anm_LSeg({"tagname":"class","name":"anm.LSeg","autodetected":{},"files":[{"filename":"segments.js","href":"segments.html#anm-LSeg"}],"members":[{"name":"constructor","tagname":"method","owner":"anm.LSeg","id":"method-constructor","meta":{}},{"name":"atDist","tagname":"method","owner":"anm.LSeg","id":"method-atDist","meta":{}},{"name":"atT","tagname":"method","owner":"anm.LSeg","id":"method-atT","meta":{}},{"name":"clone","tagname":"method","owner":"anm.LSeg","id":"method-clone","meta":{}},{"name":"crossings","tagname":"method","owner":"anm.LSeg","id":"method-crossings","meta":{}},{"name":"draw","tagname":"method","owner":"anm.LSeg","id":"method-draw","meta":{}},{"name":"findT","tagname":"method","owner":"anm.LSeg","id":"method-findT","meta":{}},{"name":"last","tagname":"method","owner":"anm.LSeg","id":"method-last","meta":{}},{"name":"length","tagname":"method","owner":"anm.LSeg","id":"method-length","meta":{}},{"name":"tangentAt","tagname":"method","owner":"anm.LSeg","id":"method-tangentAt","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-anm.LSeg","short_doc":"Represents Line Segment of an SVG-compatible curve. ...","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/segments.html#anm-LSeg' target='_blank'>segments.js</a></div></pre><div class='doc-contents'><p>Represents Line Segment of an SVG-compatible curve. Takes one point as an end of a line.</p>\n\n<p>See <a href=\"#!/api/anm.MSeg\" rel=\"anm.MSeg\" class=\"docClass\">MSeg</a>, <a href=\"#!/api/anm.CSeg\" rel=\"anm.CSeg\" class=\"docClass\">CSeg</a>, <a href=\"#!/api/anm.Path\" rel=\"anm.Path\" class=\"docClass\">Path</a>;</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='anm.LSeg'>anm.LSeg</span><br/><a href='source/segments.html#anm-LSeg-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/anm.LSeg-method-constructor' class='name expandable'>anm.LSeg</a>( <span class='pre'>pts</span> ) : <a href=\"#!/api/anm.LSeg\" rel=\"anm.LSeg\" class=\"docClass\">anm.LSeg</a><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>pts</span> : Array[Number]<div class='sub-desc'><p>points to initialize with, in format <code>[x, y]</code></p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/anm.LSeg\" rel=\"anm.LSeg\" class=\"docClass\">anm.LSeg</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-atDist' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='anm.LSeg'>anm.LSeg</span><br/><a href='source/segments.html#anm-LSeg-method-atDist' target='_blank' class='view-source'>view source</a></div><a href='#!/api/anm.LSeg-method-atDist' class='name expandable'>atDist</a>( <span class='pre'>start, dist</span> ) : Array[Number]<span class=\"signature\"></span></div><div class='description'><div class='short'>Find a point located at given distance dist in pixels. ...</div><div class='long'><p>Find a point located at given distance <code>dist</code> in pixels.\nNeeds to know a start point, which is usually a last point of a\nprevious segment or [0, 0].</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>start</span> : Array[Number]<div class='sub-desc'><p>start point in format <code>[x, y]</code></p>\n</div></li><li><span class='pre'>dist</span> : Number<div class='sub-desc'><p>distance, in pixels</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array[Number]</span><div class='sub-desc'><p>point in format <code>[x, y]</code></p>\n</div></li></ul></div></div></div><div id='method-atT' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='anm.LSeg'>anm.LSeg</span><br/><a href='source/segments.html#anm-LSeg-method-atT' target='_blank' class='view-source'>view source</a></div><a href='#!/api/anm.LSeg-method-atT' class='name expandable'>atT</a>( <span class='pre'>start, t</span> ) : Array[Number]<span class=\"signature\"></span></div><div class='description'><div class='short'>Find a point located at given distance t, which is specified in range of\n[0..1] where 0 is first point of a segment a...</div><div class='long'><p>Find a point located at given distance <code>t</code>, which is specified in range of\n<code>[0..1]</code> where <code>0</code> is first point of a segment and <code>1</code> is the last.\nNeeds to know a start point, which is usually a last point of a\nprevious segment or [0, 0].</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>start</span> : Array[Number]<div class='sub-desc'><p>start point in format <code>[x, y]</code></p>\n</div></li><li><span class='pre'>t</span> : Number<div class='sub-desc'><p><code>t</code> parameter, in range of <code>[0..1]</code></p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array[Number]</span><div class='sub-desc'><p>point in format <code>[x, y]</code></p>\n</div></li></ul></div></div></div><div id='method-clone' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='anm.LSeg'>anm.LSeg</span><br/><a href='source/segments.html#anm-LSeg-method-clone' target='_blank' class='view-source'>view source</a></div><a href='#!/api/anm.LSeg-method-clone' class='name expandable'>clone</a>( <span class='pre'></span> ) : <a href=\"#!/api/anm.LSeg\" rel=\"anm.LSeg\" class=\"docClass\">anm.LSeg</a><span class=\"signature\"></span></div><div class='description'><div class='short'>Clone this segment. ...</div><div class='long'><p>Clone this segment.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/anm.LSeg\" rel=\"anm.LSeg\" class=\"docClass\">anm.LSeg</a></span><div class='sub-desc'><p>clone</p>\n</div></li></ul></div></div></div><div id='method-crossings' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='anm.LSeg'>anm.LSeg</span><br/><a href='source/segments.html#anm-LSeg-method-crossings' target='_blank' class='view-source'>view source</a></div><a href='#!/api/anm.LSeg-method-crossings' class='name expandable'>crossings</a>( <span class='pre'>start, x, y</span> ) : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Calculates the number of times the line from (x0,y0) to (x1,y1)\ncrosses the ray extending to the right from (px,py). ...</div><div class='long'><p>Calculates the number of times the line from (x0,y0) to (x1,y1)\ncrosses the ray extending to the right from (px,py).\nIf the point lies on the line, then no crossings are recorded.\n+1 is returned for a crossing where the Y coordinate is increasing\n-1 is returned for a crossing where the Y coordinate is decreasing</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>start</span> : Array[Number]<div class='sub-desc'><p>start point in format <code>[x, y]</code></p>\n</div></li><li><span class='pre'>x</span> : Number<div class='sub-desc'><p>X-coordinate of a point to check for crossings</p>\n</div></li><li><span class='pre'>y</span> : Number<div class='sub-desc'><p>Y-coordinate of a point to check for crossings</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'><p>number of crossings</p>\n</div></li></ul></div></div></div><div id='method-draw' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='anm.LSeg'>anm.LSeg</span><br/><a href='source/segments.html#anm-LSeg-method-draw' target='_blank' class='view-source'>view source</a></div><a href='#!/api/anm.LSeg-method-draw' class='name expandable'>draw</a>( <span class='pre'>ctx</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Apply this segment to a given context ...</div><div class='long'><p>Apply this segment to a given context</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>ctx</span> : Context2D<div class='sub-desc'><p>context to draw</p>\n</div></li></ul></div></div></div><div id='method-findT' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='anm.LSeg'>anm.LSeg</span><br/><a href='source/segments.html#anm-LSeg-method-findT' target='_blank' class='view-source'>view source</a></div><a href='#!/api/anm.LSeg-method-findT' class='name expandable'>findT</a>( <span class='pre'>start, dist</span> ) : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Find t parameter in range [0, 1] corresponding to a given distance dist in pixels. ...</div><div class='long'><p>Find <code>t</code> parameter in range <code>[0, 1]</code> corresponding to a given distance <code>dist</code> in pixels.\nNeeds to know a start point, which is usually a last point of a\nprevious segment or [0, 0].</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>start</span> : Array[Number]<div class='sub-desc'><p>start point in format <code>[x, y]</code></p>\n</div></li><li><span class='pre'>dist</span> : Number<div class='sub-desc'><p>distance, in pixels</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'><p><code>t</code> in a range of <code>[0..1]</code></p>\n</div></li></ul></div></div></div><div id='method-last' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='anm.LSeg'>anm.LSeg</span><br/><a href='source/segments.html#anm-LSeg-method-last' target='_blank' class='view-source'>view source</a></div><a href='#!/api/anm.LSeg-method-last' class='name expandable'>last</a>( <span class='pre'></span> ) : Array[Number]<span class=\"signature\"></span></div><div class='description'><div class='short'>Get last point of a segment. ...</div><div class='long'><p>Get last point of a segment. For Line Segment it's always a point it was initialized with.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array[Number]</span><div class='sub-desc'><p>last point in format <code>[x, y]</code></p>\n</div></li></ul></div></div></div><div id='method-length' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='anm.LSeg'>anm.LSeg</span><br/><a href='source/segments.html#anm-LSeg-method-length' target='_blank' class='view-source'>view source</a></div><a href='#!/api/anm.LSeg-method-length' class='name expandable'>length</a>( <span class='pre'>start</span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Find length of a segment, in pixels. ...</div><div class='long'><p>Find length of a segment, in pixels. Needs to know a start point,\nwhich is usually a last point of a previous segment or [0, 0].</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>start</span> : Array[Number]<div class='sub-desc'><p>start point in format <code>[x, y]</code></p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Number segment length</p>\n</div></li></ul></div></div></div><div id='method-tangentAt' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='anm.LSeg'>anm.LSeg</span><br/><a href='source/segments.html#anm-LSeg-method-tangentAt' target='_blank' class='view-source'>view source</a></div><a href='#!/api/anm.LSeg-method-tangentAt' class='name expandable'>tangentAt</a>( <span class='pre'>start, t</span> ) : Number<span class=\"signature\"></span></div><div class='description'><div class='short'>Find a tangent at given distance t, which is specified in range of\n[0..1] where 0 is first point of a segment and 1 i...</div><div class='long'><p>Find a tangent at given distance <code>t</code>, which is specified in range of\n<code>[0..1]</code> where <code>0</code> is first point of a segment and <code>1</code> is the last.\nNeeds to know a start point, which is usually a last point of a\nprevious segment or <code>[0, 0]</code>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>start</span> : Array[Number]<div class='sub-desc'><p>start point in format <code>[x, y]</code></p>\n</div></li><li><span class='pre'>t</span> : Number<div class='sub-desc'><p><code>t</code> parameter, in range of <code>[0..1]</code></p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Number</span><div class='sub-desc'><p>tangent at given distance</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});