import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
import { deallocate } from 'async-array-buffer';
import { DataCloneErrorFactory } from './factories/data-clone-error';
import { EncodingErrorFactory } from './factories/encoding-error';
import { IndexSizeErrorFactory } from './factories/index-size-error';
import { DETACHED_ARRAY_BUFFERS } from './globals';
import { cacheTestResult } from './helpers/cache-test-result';
import { IAudioBuffer } from './interfaces';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER } from './providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from './providers/window';
import { AudioBufferCopyChannelMethodsSupportTester } from './testers/audio-buffer-copy-channel-methods-support';
import { PromiseSupportTester } from './testers/promise-support';
import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from './types';
import { AudioBufferWrapper } from './wrappers/audio-buffer';
import { AudioBufferCopyChannelMethodsWrapper } from './wrappers/audio-buffer-copy-channel-methods';

const injector = ReflectiveInjector.resolveAndCreate([
    AudioBufferCopyChannelMethodsSupportTester,
    AudioBufferCopyChannelMethodsWrapper,
    AudioBufferWrapper,
    DataCloneErrorFactory,
    EncodingErrorFactory,
    IndexSizeErrorFactory,
    PromiseSupportTester,
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    WINDOW_PROVIDER
]);

const audioBufferCopyChannelMethodsSupportTester = injector.get(AudioBufferCopyChannelMethodsSupportTester);
const audioBufferCopyChannelMethodsWrapper = injector.get(AudioBufferCopyChannelMethodsWrapper);
const audioBufferWrapper = injector.get(AudioBufferWrapper);
const dataCloneErrorFactory = injector.get(DataCloneErrorFactory);
const encodingErrorFactory = injector.get(EncodingErrorFactory);
const promiseSupportTester = injector.get(PromiseSupportTester);

const isSupportingCopyChannelMethods = (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => cacheTestResult(
    AudioBufferCopyChannelMethodsSupportTester,
    () => audioBufferCopyChannelMethodsSupportTester.test(context)
);

const isSupportingPromises = (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => cacheTestResult(
    PromiseSupportTester,
    () => promiseSupportTester.test(context)
);

export const decodeAudioData = (audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, audioData: ArrayBuffer): Promise<IAudioBuffer> => {
    // Bug #43: Only Chrome and Opera do throw a DataCloneError.
    if (DETACHED_ARRAY_BUFFERS.has(audioData)) {
        const err = dataCloneErrorFactory.create();

        return Promise.reject(err);
    }

    // The audioData parameter maybe of a type which can't be added to a WeakSet.
    try {
        DETACHED_ARRAY_BUFFERS.add(audioData);
    } catch (err) {
        // Ignore errors.
    }

    // Bug #21: Safari does not support promises yet.
    if (isSupportingPromises(audioContext)) {
        // Bug #1: Chrome requires a successCallback.
        const successCallback = () => {}; // tslint:disable-line:no-empty

        const promise = audioContext
            .decodeAudioData(audioData, successCallback)
            .catch ((err: DOMException | Error) => {
                // Bug #27: Edge is rejecting invalid arrayBuffers with a DOMException.
                if (err instanceof DOMException && err.name === 'NotSupportedError') {
                    throw new TypeError();
                }

                throw err;
            });

        setTimeout(() => {
            try {
                deallocate(audioData);
            } catch (err) { /* Ignore errors. */ }
        });

        return promise;
    }

    // Bug #21: Safari does not return a Promise yet.
    return new Promise((resolve, reject) => {
        const complete = () => {
            try {
                deallocate(audioData);
            } catch (err) { /* Ignore errors. */ }
        };

        const fail = (err: DOMException | Error) => {
            reject(err);
            complete();
        };

        const succeed = (dBffrWrppr: AudioBuffer) => {
            resolve(dBffrWrppr);
            complete();
        };

        // Bug #26: Safari throws a synchronous error.
        try {
            // Bug #1: Safari requires a successCallback.
            audioContext.decodeAudioData(audioData, (audioBuffer: AudioBuffer) => {
                // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
                if (typeof audioBuffer.copyFromChannel !== 'function') {
                    audioBufferWrapper.wrap(audioBuffer);
                // Bug #42: Firefox does not yet fully support copyFromChannel() and copyToChannel().
                } else if (!isSupportingCopyChannelMethods(audioContext)) {
                    audioBufferCopyChannelMethodsWrapper.wrap(audioBuffer);
                }

                succeed(audioBuffer);
            }, (err: DOMException | Error) => {
                // Bug #4: Safari returns null instead of an error.
                if (err === null) {
                    fail(encodingErrorFactory.create());
                } else {
                    fail(err);
                }
            });
        } catch (err) {
            fail(err);
        }
    });
};
