import 'reflect-metadata';
import { ReflectiveInjector } from '@angular/core';
import { unpatchedAudioContextConstructor } from '../../../../src/unpatched-audio-context-constructor';
import { window as wndw } from '../../../../src/window';

describe('audioContextConstructor', function () {

    var audioContext,
        AudioContext;

    beforeEach(function () {
        /* eslint-disable indent */
        var injector = ReflectiveInjector.resolveAndCreate([
                { provide: unpatchedAudioContextConstructor, useFactory: unpatchedAudioContextConstructor },
                { provide: wndw, useValue: window }
            ]);
        /* eslint-enable indent */

        AudioContext = injector.get(unpatchedAudioContextConstructor);

        audioContext = new AudioContext();
    });

    describe('createIIRFilter()', function () {

        describe('getFrequencyResponse()', function () {

            // bug #23

            it('should not throw an NotSupportedError', function () {
                var iIRFilterNode = audioContext.createIIRFilter([ 1 ], [ 1 ]);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
            });

            // bug #24

            it('should not throw an NotSupportedError', function () {
                var iIRFilterNode = audioContext.createIIRFilter([ 1 ], [ 1 ]);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
            });

        });

    });

});
