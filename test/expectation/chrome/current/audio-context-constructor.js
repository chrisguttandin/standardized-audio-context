import 'core-js/es7/reflect';
import { UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedAudioContextConstructor } from '../../../../src/providers/unpatched-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../../src/providers/window';
import { spy } from 'sinon';

describe('audioContextConstructor', () => {

    let audioContext;
    let AudioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            WINDOW_PROVIDER
        ]);

        AudioContext = injector.get(unpatchedAudioContextConstructor);

        audioContext = new AudioContext();
    });

    describe('baseLatency', () => {

        // bug #39

        it('should not be implemented', () => {
            expect(audioContext.baseLatency).to.be.undefined;
        });

    });

    describe('outputLatency', () => {

        // bug #40

        it('should not be implemented', () => {
            expect(audioContext.outputLatency).to.be.undefined;
        });

    });

    describe('state', () => {

        // bug #34

        it('should be set to running right away', () => {
            expect(audioContext.state).to.equal('running');
        });

    });

    describe('createAnalyser()', () => {

        // bug #37

        it('should have a channelCount of 2', () => {
            const analyserNode = audioContext.createAnalyser();

            expect(analyserNode.channelCount).to.equal(2);
        });

    });

    describe('createChannelSplitter()', () => {

        // bug #30

        it('should allow to set the channelCountMode', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            channelSplitterNode.channelCountMode = 'explicit';
        });

        // bug #31

        it('should have a channelInterpretation of max', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
        });

        // bug #32

        it('should allow to set the channelInterpretation', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            channelSplitterNode.channelInterpretation = 'discrete';
        });

    });

    describe('createGain()', () => {

        let gainNode;

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
            const errorCallback = spy();

            audioContext.decodeAudioData(null, () => {}, errorCallback);

            setTimeout(() => {
                expect(errorCallback).to.have.not.been.called;

                done();
            }, 1000);
        });

    });

});
