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

    describe('createBiquadFilter()', () => {

        describe('getFrequencyResponse()', () => {

            // bug #22

            it('should fill the magResponse and phaseResponse arrays with the deprecated algorithm', () => {
                var biquadFilterNode = audioContext.createBiquadFilter(),
                    magResponse = new Float32Array(5),
                    phaseResponse = new Float32Array(5);

                biquadFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                expect(Array.from(magResponse)).to.deep.equal([ 1.1107852458953857, 0.8106917142868042, 0.20565471053123474, 0.04845593497157097, 0.011615658178925514 ]);
                expect(Array.from(phaseResponse)).to.deep.equal([ -0.7254799008369446, -1.8217267990112305, -2.6273605823516846, -2.906902313232422, -3.0283825397491455 ]);
            });

        });

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

    describe('createIIRFilter()', () => {

        // bug #9

        it('should not be implemented', () => {
            expect(audioContext.createIIRFilter).to.be.undefined;
        });

    });

});
