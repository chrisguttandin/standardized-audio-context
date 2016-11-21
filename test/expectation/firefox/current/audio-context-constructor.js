import 'core-js/es7/reflect';
import { UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedAudioContextConstructor } from '../../../../src/providers/unpatched-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../../src/providers/window';

describe('audioContextConstructor', () => {

    var audioContext,
        AudioContext;

    beforeEach(() => {
        /* eslint-disable indent */
        var injector = ReflectiveInjector.resolveAndCreate([
                UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
                WINDOW_PROVIDER
            ]);
        /* eslint-enable indent */

        AudioContext = injector.get(unpatchedAudioContextConstructor);

        audioContext = new AudioContext();
    });

    describe('createGain()', () => {

        // bug #12

        it('should not allow to disconnect a specific destination', (done) => {
            var analyzer,
                candidate,
                channelData,
                dummy,
                ones,
                source;

            analyzer = audioContext.createScriptProcessor(256, 1, 1);
            candidate = audioContext.createGain();
            dummy = audioContext.createGain();

            ones = audioContext.createBuffer(1, 1, 44100);
            channelData = ones.getChannelData(0);
            channelData[0] = 1;

            source = audioContext.createBufferSource();
            source.buffer = ones;
            source.loop = true;

            source.connect(candidate);
            candidate.connect(analyzer);
            analyzer.connect(audioContext.destination);
            candidate.connect(dummy);
            candidate.disconnect(dummy);

            analyzer.onaudioprocess = (event) => {
                var channelData = event.inputBuffer.getChannelData(0);

                if (Array.prototype.some.call(channelData, (sample) => sample === 1)) {
                    done('should never happen');
                }
            };

            source.start();

            setTimeout(() => {
                source.stop();

                analyzer.onaudioprocess = null;

                source.disconnect(candidate);
                candidate.disconnect(analyzer);
                analyzer.disconnect(audioContext.destination);

                done();
            }, 500);
        });

    });

});
