import { AudioContextState } from '../enums/audio-context-state';

export interface IAudioContext {

    readonly currentTime: number;

    readonly destination: AudioDestinationNode;

    onstatechange: Function;

    readonly sampleRate: number;

    readonly state: AudioContextState;

    close(): Promise<void>;

    createAnalyser(): AnalyserNode;

    createBiquadFilter(): BiquadFilterNode;

    createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;

    createBufferSource(): AudioBufferSourceNode;

    createChannelMerger(numberOfInputs: number): ChannelMergerNode;

    createChannelSplitter(numberOfOutputs: number): ChannelSplitterNode;

    createGain(): GainNode;

    createIIRFilter(feedforward: number[], feedback: number[]); // @todo IIRFilterNode;

    decodeAudioData(
        audioData: ArrayBuffer,
        successCallback?: (decodedData: AudioBuffer) => {},
        errorCallback?: (error: DOMException) => {}
    ): Promise<AudioBuffer>;

}

export interface IAudioContextConstructor {

    new (): IAudioContext;

}
