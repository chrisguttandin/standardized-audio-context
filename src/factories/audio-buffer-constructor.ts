import { cacheTestResult } from '../helpers/cache-test-result';
import { IAudioBuffer, IAudioBufferOptions } from '../interfaces';
import { testAudioBufferCopyChannelMethodsSubarraySupport } from '../support-testers/audio-buffer-copy-channel-methods-subarray';
import { TAudioBufferConstructorFactory, TNativeOfflineAudioContext } from '../types';
import { wrapAudioBufferCopyChannelMethods } from '../wrappers/audio-buffer-copy-channel-methods';
import { wrapAudioBufferCopyChannelMethodsSubarray } from '../wrappers/audio-buffer-copy-channel-methods-subarray';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
};

export const createAudioBufferConstructor: TAudioBufferConstructorFactory = (nativeOfflineAudioContextConstructor) => {

    let nativeOfflineAudioContext: null | TNativeOfflineAudioContext = null;

    return class AudioBuffer implements IAudioBuffer {

        public duration: number;

        public length: number;

        public numberOfChannels: number;

        public sampleRate: number;

        constructor (options: IAudioBufferOptions) {
            if (nativeOfflineAudioContextConstructor === null) {
                throw new Error(); // @todo
            }

            const { length, numberOfChannels, sampleRate } = <typeof DEFAULT_OPTIONS & IAudioBufferOptions> {
                ...DEFAULT_OPTIONS,
                ...options
            };

            if (nativeOfflineAudioContext === null) {
                nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);
            }

            const audioBuffer = nativeOfflineAudioContext.createBuffer(numberOfChannels, length, sampleRate);

            // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
            if (typeof audioBuffer.copyFromChannel !== 'function') {
                wrapAudioBufferCopyChannelMethods(audioBuffer);
            // Bug #42: Firefox does not yet fully support copyFromChannel() and copyToChannel().
            } else if (!cacheTestResult(
                testAudioBufferCopyChannelMethodsSubarraySupport,
                () => testAudioBufferCopyChannelMethodsSubarraySupport(audioBuffer)
            )) {
                wrapAudioBufferCopyChannelMethodsSubarray(audioBuffer);
            }

            /*
             * This does violate all good pratices but it is necessary to allow this AudioBuffer to be used with native
             * (Offline)AudioContexts.
             */
            return audioBuffer;
        }

        // This method needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
        public getChannelData (_: number): Float32Array {
            return new Float32Array(0);
        }

        // This method needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
        public copyFromChannel (_1: Float32Array, _2: number, _3 = 0): void { } // tslint:disable-line:no-empty

        // This method needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
        public copyToChannel (_1: Float32Array, _2: number, _3 = 0): void { } // tslint:disable-line:no-empty

    };

};
