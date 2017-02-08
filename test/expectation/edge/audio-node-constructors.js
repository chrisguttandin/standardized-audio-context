import 'core-js/es7/reflect';
import { UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedAudioContextConstructor } from '../../../src/providers/unpatched-audio-context-constructor';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../src/providers/window';

describe('audioNodeConstructors', () => {

    let audioContext;
    let AudioContext;

    // @todo Use beforeEach() again and split the tests in separate files when the AudioContext can be closed.
    before(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            UNPATCHED_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
            WINDOW_PROVIDER
        ]);

        AudioContext = injector.get(unpatchedAudioContextConstructor);

        audioContext = new AudioContext();
    });

    describe('analyserNodeConstructor', () => {

        // bug #33

        it('should not allow to construct a AnalyserNode', () => {
            expect(() => {
                new AnalyserNode(audioContext, {});
            }).to.throw(TypeError, 'Function expected');
        });

    });

    describe('audioBufferSourceNodeConstructor', () => {

        // bug #33

        it('should not allow to construct a AudioBufferSourceNode', () => {
            expect(() => {
                new AudioBufferSourceNode(audioContext, {});
            }).to.throw(TypeError, 'Function expected');
        });

    });

    describe('biquadFilterNodeConstructor', () => {

        // bug #33

        it('should not allow to construct a BiquadFilterNode', () => {
            expect(() => {
                new BiquadFilterNode(audioContext, {});
            }).to.throw(TypeError, 'Function expected');
        });

    });

    describe('channelMergerNodeConstructor', () => {

        // bug #33

        it('should not allow to construct a ChannelMergerNode', () => {
            expect(() => {
                new ChannelMergerNode(audioContext, {});
            }).to.throw(TypeError, 'Function expected');
        });

    });

    describe('channelSplitterNodeConstructor', () => {

        // bug #33

        it('should not allow to construct a ChannelSplitterNode', () => {
            expect(() => {
                new ChannelSplitterNode(audioContext, {});
            }).to.throw(TypeError, 'Function expected');
        });

    });

    describe('gainNodeConstructor', () => {

        // bug #33

        it('should not allow to construct a GainNode', () => {
            expect(() => {
                new GainNode(audioContext, {});
            }).to.throw(TypeError, 'Function expected');
        });

    });

    describe('iIRFilterNodeConstructor', () => {

        // bug #33

        it('should not allow to construct a IIRFilterNode', () => {
            expect(() => {
                new IIRFilterNode(audioContext, { feedback: [ 1 ], feedforward: [ 1 ] }); // eslint-disable-line no-undef
            }).to.throw(TypeError, 'Function expected');
        });

    });

    describe('oscillatorNodeConstructor', () => {

        // bug #33

        it('should not allow to construct a OscillatorNode', () => {
            expect(() => {
                new OscillatorNode(audioContext, {});
            }).to.throw(TypeError, 'Function expected');
        });

    });

});
