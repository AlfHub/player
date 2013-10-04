/*
 * Copyright (c) 2011-2013 by Animatron.
 * All rights are reserved.
 *
 * Animatron player is licensed under the MIT License, see LICENSE.
 */

describe("resource manager", function() {

    beforeEach(function() {
        this.addMatchers(_matchers.calls);

        _mocks.adaptDocument(document);
        _fake(_Fake.CVS_POS);

        //_fg = _FrameGen.spawn().run(FPS);
    });

    //afterEach(function() { _fg.stop().destroy(); });

    it("triggers all the callbacks when given resources are loaded", function() {
        // TODO
    });

    xit("when different callbacks are subscribed to different, but intersecting,
        combinations of resources, calls every callback in a proper time", function() {
        // TODO
    });

    xit("loader should not be triggered when resource is already in cache", function() {
        // TODO
    })

    xit("triggers callbacks second time if cached resource was requested to load again", function() {
        // TODO
    });

    describe("inside the player", function() {

        xit("if there are no remote resources, LOAD event should be fired immediately", function() {
            // TODO
        });

        xit("player should fire LOAD event only when all remote resource has been loaded", function() {
            // TODO
        });

        xit("player should have have LOADING state before loading remote resources", function() {
            // TODO
        });

        xit("player should have have RES_LOADING state when loading remote resources", function() {
            // TODO
        });

        xit("player should not fire RES_LOAD event when there are no remote resources", function() {
            // TODO
        });

        xit("player should not fire RES_LOAD event when remote resources are not ready", function() {
            // TODO
        });

        xit("player should fire RES_LOAD event when started to load remote resources", function() {
            // TODO
        });

        xit("playing should be allowed to start only when all remote resources are loaded", function() {
            // TODO
        });

    });

    // TODO: add tests for RES_LOAD event in playing.spec

});