import { Injector } from '@angular/core';
import { deallocate } from 'async-array-buffer';
import { createDataCloneError } from './factories/data-clone-error';
import { createEncodingError } from './factories/encoding-error';
import { DETACHED_ARRAY_BUFFERS } from './globals';
import { cacheTestResult } from './helpers/cache-test-result';
import { IAudioBuffer } from './interfaces';
import { UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER } from './providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from './providers/window';
import {
    AUDIO_BUFFER_COPY_CHANNEL_METHODS_SUPPORT_TESTER_PROVIDER,
    AudioBufferCopyChannelMethodsSupportTester
} from './support-testers/audio-buffer-copy-channel-methods';
import { PROMISE_SUPPORT_TESTER_PROVIDER, PromiseSupportTester } from './support-testers/promise';
import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from './types';
import { wrapAudioBuffer } from './wrappers/audio-buffer';
import { wrapAudioBufferCopyChannelMethodsWrapper } from './wrappers/audio-buffer-copy-channel-methods';

const injector = Injector.create({
    providers: [
        AUDIO_BUFFER_COPY_CHANNEL_METHODS_SUPPORT_TESTER_PROVIDER,
        PROMISE_SUPPORT_TESTER_PROVIDER,
        UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
        WINDOW_PROVIDER
    ]
});

const audioBufferCopyChannelMethodsSupportTester = injector.get(AudioBufferCopyChannelMethodsSupportTester);
const promiseSupportTester = injector.get(PromiseSupportTester);

const isSupportingCopyChannelMethods = (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => cacheTestResult(
    AudioBufferCopyChannelMethodsSupportTester,
    () => audioBufferCopyChannelMethodsSupportTester.test(context)
);

const isSupportingPromises = (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => cacheTestResult(
    PromiseSupportTester,
    () => promiseSupportTester.test(context)
);

export const decodeAudioData = (
    audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    audioData: ArrayBuffer
): Promise<IAudioBuffer> => {
    // Bug #43: Only Chrome and Opera do throw a DataCloneError.
    if (DETACHED_ARRAY_BUFFERS.has(audioData)) {
        const err = createDataCloneError();

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
        const promise = audioContext
            .decodeAudioData(audioData)
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
                    wrapAudioBuffer(audioBuffer);
                // Bug #42: Firefox does not yet fully support copyFromChannel() and copyToChannel().
                } else if (!isSupportingCopyChannelMethods(audioContext)) {
                    wrapAudioBufferCopyChannelMethodsWrapper(audioBuffer);
                }

                succeed(audioBuffer);
            }, (err: DOMException | Error) => {
                // Bug #4: Safari returns null instead of an error.
                if (err === null) {
                    fail(createEncodingError());
                } else {
                    fail(err);
                }
            });
        } catch (err) {
            fail(err);
        }
    });
};
