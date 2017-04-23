export interface IOfflineAudioContext {

    readonly currentTime: number;

    readonly destination: AudioDestinationNode;

    readonly length: number;

    readonly sampleRate: number;

    // @todo new(numberOfChannels: number, length: number, sampleRate: number);

    createBiquadFilter(): BiquadFilterNode;

    createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;

    createBufferSource(): AudioBufferSourceNode;

    createGain(): GainNode;

    createIIRFilter(feedforward: [ number ], feedback): [ number ]; // @todo IIRFilterNode;

    decodeAudioData(
        audioData: ArrayBuffer,
        successCallback?: (decodedData: AudioBuffer) => {},
        errorCallback?: (error: DOMException) => {}
    ): Promise<AudioBuffer>;

    startRendering(): Promise<AudioBuffer>;

}

export interface IOfflineAudioContextConstructor {

    new (numberOfChannels: number, length: number, sampleRate: number): IOfflineAudioContext;

}
