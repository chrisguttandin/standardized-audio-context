export interface IAudioBuffer {

    readonly duration: number;

    readonly length: number;

    readonly numberOfChannels: number;

    readonly sampleRate: number;

    copyFromChannel (destination: Float32Array, channelNumber: number, startInChannel?: number): void;

    copyToChannel (source: Float32Array, channelNumber: number, startInChannel?: number): void;

    getChannelData (channel: number): Float32Array;

}
