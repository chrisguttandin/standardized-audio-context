'use strict';

var di = require('di'),
    unpatchedAudioContextProvider = require('../../src/unpatched-audio-context.js').provider,
    windowProvider = require('../../src/window.js').provider;

describe('UnpatchedAudioContext', function () {

    describe('provider', function () {

        var AudioContext,
            injector,
            webkitAudioContext;

        beforeEach(function () {
            AudioContext = 'a fake AudioContext';

            webkitAudioContext = 'a fake webkitAudioContext';
        });

        it('should return null if there is no AudioContext', function () {
            function fakeWindowProvider() {
                return {};
            }

            di.annotate(fakeWindowProvider, new di.Provide(windowProvider));

            injector = new di.Injector([
                fakeWindowProvider
            ]);

            expect(injector.get(unpatchedAudioContextProvider)).to.equal(null);
        });

        it('should return the prefixed AudioContext', function () {
            function fakeWindowProvider() {
                return {
                    webkitAudioContext: webkitAudioContext
                };
            }

            di.annotate(fakeWindowProvider, new di.Provide(windowProvider));

            injector = new di.Injector([
                fakeWindowProvider
            ]);

            expect(injector.get(unpatchedAudioContextProvider)).to.equal(webkitAudioContext);
        });

        it('should return the unprefixed AudioContext', function () {
            function fakeWindowProvider() {
                return {
                    AudioContext: AudioContext
                };
            }

            di.annotate(fakeWindowProvider, new di.Provide(windowProvider));

            injector = new di.Injector([
                fakeWindowProvider
            ]);

            expect(injector.get(unpatchedAudioContextProvider)).to.equal(AudioContext);
        });

        it('should return the unprefixed AudioContext even if there is a prefixed version as well', function () {
            function fakeWindowProvider() {
                return {
                    AudioContext: AudioContext,
                    webkitAudioContext: webkitAudioContext
                };
            }

            di.annotate(fakeWindowProvider, new di.Provide(windowProvider));

            injector = new di.Injector([
                fakeWindowProvider
            ]);

            expect(injector.get(unpatchedAudioContextProvider)).to.equal(AudioContext);
        });

    });

});
