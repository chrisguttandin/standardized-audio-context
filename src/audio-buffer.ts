import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
import { IndexSizeErrorFactory } from './factories/index-size-error';
import { cacheTestResult } from './helpers/cache-test-result';
import { IAudioBuffer, IAudioBufferOptions } from './interfaces';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER, unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr } from './providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from './providers/window';
import { AudioBufferCopyChannelMethodsSupportTester } from './support-testers/audio-buffer-copy-channel-methods';
import { AudioBufferWrapper } from './wrappers/audio-buffer';
import { AudioBufferCopyChannelMethodsWrapper } from './wrappers/audio-buffer-copy-channel-methods';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
};

const injector = ReflectiveInjector.resolveAndCreate([
    AudioBufferWrapper,
    AudioBufferCopyChannelMethodsSupportTester,
    AudioBufferCopyChannelMethodsWrapper,
    IndexSizeErrorFactory,
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    WINDOW_PROVIDER
]);

const audioBufferWrapper = injector.get(AudioBufferWrapper);
const audioBufferCopyChannelMethodsSupportTester = injector.get(AudioBufferCopyChannelMethodsSupportTester);
const audioBufferCopyChannelMethodsWrapper = injector.get(AudioBufferCopyChannelMethodsWrapper);
const unpatchedOfflineAudioContextConstructor = injector.get(nptchdFflnDCntxtCnstrctr);

export class AudioBuffer implements IAudioBuffer {

    public duration: number;

    public length: number;

    public numberOfChannels: number;

    public sampleRate: number;

    constructor (options: IAudioBufferOptions) {
        const { length, numberOfChannels, sampleRate } = <typeof DEFAULT_OPTIONS & IAudioBufferOptions> { ...DEFAULT_OPTIONS, ...options };

        const unpatchedOfflineAudioContext = new unpatchedOfflineAudioContextConstructor(1, 1, 44100);
        const audioBuffer = unpatchedOfflineAudioContext.createBuffer(numberOfChannels, length, sampleRate);

        // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
        if (typeof audioBuffer.copyFromChannel !== 'function') {
            audioBufferWrapper.wrap(audioBuffer);
        // Bug #42: Firefox does not yet fully support copyFromChannel() and copyToChannel().
        } else if (
            !cacheTestResult(
                AudioBufferCopyChannelMethodsSupportTester,
                () => audioBufferCopyChannelMethodsSupportTester.test(unpatchedOfflineAudioContext)
            )
        ) {
            audioBufferCopyChannelMethodsWrapper.wrap(audioBuffer);
        }

        // This does violate all good pratices but it is necessary to allow this AudioBuffer to be used with native (Offline)AudioContexts.
        return audioBuffer;
    }

    // This method needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
    public getChannelData (_: number): Float32Array {
        return new Float32Array(0);
    }

    // This method needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
    public copyFromChannel (_1: Float32Array, _2: number, _3: number = 0): void { }

    // This method needs to be defined to convince TypeScript that the IAudioBuffer will be implemented.
    public copyToChannel (_1: Float32Array, _2: number, _3: number = 0): void { }

}
