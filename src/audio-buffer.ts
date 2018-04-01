import { Injector } from '@angular/core';
import { cacheTestResult } from './helpers/cache-test-result';
import { IAudioBuffer, IAudioBufferOptions } from './interfaces';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr
} from './providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from './providers/window';
import { testAudioBufferCopyChannelMethodsSubarraySupport } from './support-testers/audio-buffer-copy-channel-methods-subarray';
import { TUnpatchedOfflineAudioContext } from './types';
import { wrapAudioBufferCopyChannelMethods } from './wrappers/audio-buffer-copy-channel-methods';
import { wrapAudioBufferCopyChannelMethodsSubarray } from './wrappers/audio-buffer-copy-channel-methods-subarray';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
};

const injector = Injector.create({
    providers: [
        UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
        WINDOW_PROVIDER
    ]
});

const unpatchedOfflineAudioContextConstructor = injector.get(nptchdFflnDCntxtCnstrctr);

let unpatchedOfflineAudioContext: null | TUnpatchedOfflineAudioContext = null;

export class AudioBuffer implements IAudioBuffer {

    public duration: number;

    public length: number;

    public numberOfChannels: number;

    public sampleRate: number;

    constructor (options: IAudioBufferOptions) {
        if (unpatchedOfflineAudioContextConstructor === null) {
            throw new Error(); // @todo
        }

        const { length, numberOfChannels, sampleRate } = <typeof DEFAULT_OPTIONS & IAudioBufferOptions> { ...DEFAULT_OPTIONS, ...options };

        if (unpatchedOfflineAudioContext === null) {
            unpatchedOfflineAudioContext = new unpatchedOfflineAudioContextConstructor(1, 1, 44100);
        }

        const audioBuffer = unpatchedOfflineAudioContext.createBuffer(numberOfChannels, length, sampleRate);

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

        // This does violate all good pratices but it is necessary to allow this AudioBuffer to be used with native (Offline)AudioContexts.
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

}
