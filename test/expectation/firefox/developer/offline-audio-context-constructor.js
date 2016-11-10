import 'core-js/es7/reflect';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedOfflineAudioContextConstructor } from '../../../../src/providers/unpatched-offline-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../../src/providers/window';

describe('offlineAudioContextConstructor', () => {

    var offlineAudioContext,
        OfflineAudioContext;

    beforeEach(() => {
        /* eslint-disable indent */
        var injector = ReflectiveInjector.resolveAndCreate([
                UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
                WINDOW_PROVIDER
            ]);
        /* eslint-enable indent */

        OfflineAudioContext = injector.get(unpatchedOfflineAudioContextConstructor);

        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('createIIRFilter()', () => {

        describe('getFrequencyResponse()', () => {

            // bug #23

            it('should not throw an NotSupportedError', () => {
                var iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
            });

            // bug #24

            it('should not throw an NotSupportedError', () => {
                var iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
            });

        });

    });

});
