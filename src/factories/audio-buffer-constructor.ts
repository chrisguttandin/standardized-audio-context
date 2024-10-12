import { IAudioBuffer, IAudioBufferOptions } from '../interfaces';
import { TAudioBufferConstructorFactory } from '../types';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
} as const;

export const createAudioBufferConstructor: TAudioBufferConstructorFactory = (audioBufferStore, nativeAudioBufferConstructor) => {
    return class AudioBuffer implements IAudioBuffer {
        // This field needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
        public copyFromChannel!: (destination: Float32Array, channelNumber: number, bufferOffset?: number) => void;

        // This field needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
        public copyToChannel!: (source: Float32Array, channelNumber: number, bufferOffset?: number) => void;

        // This field needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
        public duration!: number;

        // This field needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
        public getChannelData!: (channel: number) => Float32Array;

        // This field needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
        public length!: number;

        // This field needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
        public numberOfChannels!: number;

        // This field needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
        public sampleRate!: number;

        constructor(options: IAudioBufferOptions) {
            if (nativeAudioBufferConstructor === null) {
                throw new Error('Missing the native AudioBuffer constructor.');
            }

            const { length, numberOfChannels, sampleRate } = { ...DEFAULT_OPTIONS, ...options };

            const audioBuffer = new nativeAudioBufferConstructor({ length, numberOfChannels, sampleRate });

            audioBufferStore.add(audioBuffer);

            /*
             * This does violate all good pratices but it is necessary to allow this AudioBuffer to be used with native
             * (Offline)AudioContexts.
             */
            return audioBuffer;
        }

        public static [Symbol.hasInstance](instance: unknown): boolean {
            return (
                (instance !== null && typeof instance === 'object' && Object.getPrototypeOf(instance) === AudioBuffer.prototype) ||
                audioBufferStore.has(<any>instance)
            );
        }
    };
};
