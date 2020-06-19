// @todo TypeScript doesn't know yet about globally available constructors.

// tslint:disable-next-line:interface-name
interface Window {
    AudioBuffer: {
        prototype: AudioBuffer;

        new (options: AudioBufferOptions): AudioBuffer;
    };

    AudioContext: {
        prototype: AudioContext;

        new (contextOptions?: AudioContextOptions): AudioContext;
    };

    AudioNode: {
        prototype: AudioNode;
    };

    AudioParam: {
        prototype: AudioParam;
    };

    AudioWorkletNode: {
        prototype: AudioWorkletNode;

        new (context: BaseAudioContext, name: string, options?: AudioWorkletNodeOptions): AudioWorkletNode;
    };

    OfflineAudioContext: {
        prototype: OfflineAudioContext;

        new (contextOptions: OfflineAudioContextOptions): OfflineAudioContext;
        new (numberOfChannels: number, length: number, sampleRate: number): OfflineAudioContext;
    };
}
