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

    describe('createChannelSplitter()', () => {

        // bug #29

        it('should have a channelCountMode of max', () => {
            var channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelCountMode).to.equal('max');
        });

        // bug #30

        it('should allow to set the channelCountMode', () => {
            var channelSplitterNode = audioContext.createChannelSplitter();

            channelSplitterNode.channelCountMode = 'explicit';
        });

        // bug #31

        it('should have a channelInterpretation of max', () => {
            var channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
        });

        // bug #32

        it('should allow to set the channelInterpretation', () => {
            var channelSplitterNode = audioContext.createChannelSplitter();

            channelSplitterNode.channelInterpretation = 'discrete';
        });

    });

    describe('createGain()', () => {

        var gainNode;

        beforeEach(() => {
            gainNode = audioContext.createGain();
        });

        describe('cancelAndHoldAtTime()', () => {

            // bug #28

            it('should not be implemented', () => {
                expect(gainNode.cancelAndHoldAtTime).to.be.undefined;
            });

        });

    });

    describe('decodeAudioData()', () => {

        // bug #6

        it('should not call the errorCallback at all', (done) => {
            var errorCallback = sinon.spy(); // eslint-disable-line no-undef

            audioContext.decodeAudioData(null, () => {}, errorCallback);

            setTimeout(() => {
                expect(errorCallback).to.have.not.been.called;

                done();
            }, 1000);
        });

    });

});
