import {
    AnalyserNode,
    AudioBuffer,
    AudioBufferSourceNode,
    AudioContext,
    AudioWorkletNode,
    BiquadFilterNode,
    ChannelMergerNode,
    ChannelSplitterNode,
    ConstantSourceNode,
    ConvolverNode,
    DelayNode,
    DynamicsCompressorNode,
    GainNode,
    IIRFilterNode,
    MediaElementAudioSourceNode,
    MediaStreamAudioDestinationNode,
    MediaStreamAudioSourceNode,
    MinimalAudioContext,
    MinimalOfflineAudioContext,
    OfflineAudioContext,
    OscillatorNode,
    PannerNode,
    PeriodicWave,
    StereoPannerNode,
    WaveShaperNode,
    addAudioWorkletModule,
    decodeAudioData,
    isAnyAudioNode,
    isAnyAudioParam,
    isSupported
} from '../../src/module';

describe('module', () => {

    it('should export the AnalyserNode constructor', () => {
        expect(AnalyserNode).to.be.a('function');
    });

    it('should export the AudioBuffer constructor', () => {
        expect(AudioBuffer).to.be.a('function');
    });

    it('should export the AudioBufferSourceNode constructor', () => {
        expect(AudioBufferSourceNode).to.be.a('function');
    });

    it('should export the AudioContext constructor', () => {
        expect(AudioContext).to.be.a('function');
    });

    it('should export the AudioWorkletNode constructor', () => {
        expect(AudioWorkletNode).to.be.a('function');
    });

    it('should export the BiquadFilterNode constructor', () => {
        expect(BiquadFilterNode).to.be.a('function');
    });

    it('should export the ChannelMergerNode constructor', () => {
        expect(ChannelMergerNode).to.be.a('function');
    });

    it('should export the ChannelSplitterNode constructor', () => {
        expect(ChannelSplitterNode).to.be.a('function');
    });

    it('should export the ConstantSourceNode constructor', () => {
        expect(ConstantSourceNode).to.be.a('function');
    });

    it('should export the ConvolverNode constructor', () => {
        expect(ConvolverNode).to.be.a('function');
    });

    it('should export the DelayNode constructor', () => {
        expect(DelayNode).to.be.a('function');
    });

    it('should export the DynamicsCompressorNode constructor', () => {
        expect(DynamicsCompressorNode).to.be.a('function');
    });

    it('should export the GainNode constructor', () => {
        expect(GainNode).to.be.a('function');
    });

    it('should export the IIRFilterNode constructor', () => {
        expect(IIRFilterNode).to.be.a('function');
    });

    it('should export the MediaElementAudioSourceNode constructor', () => {
        expect(MediaElementAudioSourceNode).to.be.a('function');
    });

    it('should export the MediaStreamAudioDestinationNode constructor', () => {
        expect(MediaStreamAudioDestinationNode).to.be.a('function');
    });

    it('should export the MediaStreamAudioSourceNode constructor', () => {
        expect(MediaStreamAudioSourceNode).to.be.a('function');
    });

    it('should export the MinimalAudioContext constructor', () => {
        expect(MinimalAudioContext).to.be.a('function');
    });

    it('should export the MinimalOfflineAudioContext constructor', () => {
        expect(MinimalOfflineAudioContext).to.be.a('function');
    });

    it('should export the OfflineAudioContext constructor', () => {
        expect(OfflineAudioContext).to.be.a('function');
    });

    it('should export the OscillatorNode constructor', () => {
        expect(OscillatorNode).to.be.a('function');
    });

    it('should export the PannerNode constructor', () => {
        expect(PannerNode).to.be.a('function');
    });

    it('should export the PeriodicWave constructor', () => {
        expect(PeriodicWave).to.be.a('function');
    });

    it('should export the StereoPannerNode constructor', () => {
        expect(StereoPannerNode).to.be.a('function');
    });

    it('should export the WaveShaperNode constructor', () => {
        expect(WaveShaperNode).to.be.a('function');
    });

    it('should export the addAudioWorkletModule function', () => {
        expect(addAudioWorkletModule).to.be.a('function');
    });

    it('should export the decodeAudioData function', () => {
        expect(decodeAudioData).to.be.a('function');
    });

    it('should export the isAnyAudioNode function', () => {
        expect(isAnyAudioNode).to.be.a('function');
    });

    it('should export the isAnyAudioParam function', () => {
        expect(isAnyAudioParam).to.be.a('function');
    });

    it('should export the isSupported function', () => {
        expect(isSupported).to.be.a('function');
    });

});
