'use strict';

var di = require('di'),
    UnpatchedAudioContext = require('../../src/unpatched-audio-context.js').UnpatchedAudioContext,
    Window = require('../../src/window.js').Window;

describe('UnpatchedAudioContext', function () {

    var AudioContext,
        injector,
        webkitAudioContext;

    beforeEach(function () {
        AudioContext = 'a fake AudioContext';

        webkitAudioContext = 'a fake webkitAudioContext';
    });

    it('should return null if there is no AudioContext', function () {
        function FakeWindow() {
            return {};
        }

        di.annotate(FakeWindow, new di.Provide(Window));

        injector = new di.Injector([
            FakeWindow
        ]);

        expect(injector.get(UnpatchedAudioContext)).to.equal(null);
    });

    it('should return the prefixed AudioContext', function () {
        function FakeWindow() {
            return {
                webkitAudioContext: webkitAudioContext
            };
        }

        di.annotate(FakeWindow, new di.Provide(Window));

        injector = new di.Injector([
            FakeWindow
        ]);

        expect(injector.get(UnpatchedAudioContext)).to.equal(webkitAudioContext);
    });

    it('should return the unprefixed AudioContext', function () {
        function FakeWindow() {
            return {
                AudioContext: AudioContext
            };
        }

        di.annotate(FakeWindow, new di.Provide(Window));

        injector = new di.Injector([
            FakeWindow
        ]);

        expect(injector.get(UnpatchedAudioContext)).to.equal(AudioContext);
    });

    it('should return the unprefixed AudioContext even if there is a prefixed version as well', function () {
        function FakeWindow() {
            return {
                AudioContext: AudioContext,
                webkitAudioContext: webkitAudioContext
            };
        }

        di.annotate(FakeWindow, new di.Provide(Window));

        injector = new di.Injector([
            FakeWindow
        ]);

        expect(injector.get(UnpatchedAudioContext)).to.equal(AudioContext);
    });

});
