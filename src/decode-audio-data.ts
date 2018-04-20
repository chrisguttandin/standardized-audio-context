import { deallocate } from 'async-array-buffer';
import { createDataCloneError } from './factories/data-clone-error';
import { createEncodingError } from './factories/encoding-error';
import { DETACHED_ARRAY_BUFFERS } from './globals';
import { cacheTestResult } from './helpers/cache-test-result';
import { IAudioBuffer } from './interfaces';
import { testAudioBufferCopyChannelMethodsSubarraySupport } from './support-testers/audio-buffer-copy-channel-methods-subarray';
import { testPromiseSupport } from './support-testers/promise';
import { TNativeAudioBuffer, TNativeContext } from './types';
import { wrapAudioBufferCopyChannelMethods } from './wrappers/audio-buffer-copy-channel-methods';
import { wrapAudioBufferCopyChannelMethodsSubarray } from './wrappers/audio-buffer-copy-channel-methods-subarray';

const isSupportingCopyChannelMethodsSubarray = (nativeAudioBuffer: TNativeAudioBuffer) => cacheTestResult(
    testAudioBufferCopyChannelMethodsSubarraySupport,
    () => testAudioBufferCopyChannelMethodsSubarraySupport(nativeAudioBuffer)
);

const isSupportingPromises = (nativeContext: TNativeContext) => cacheTestResult(
    testPromiseSupport,
    () => testPromiseSupport(nativeContext)
);

export const decodeAudioData = (
    nativeContext: TNativeContext,
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
    if (isSupportingPromises(nativeContext)) {
        const promise = nativeContext
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
            nativeContext.decodeAudioData(audioData, (audioBuffer: AudioBuffer) => {
                // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
                if (typeof audioBuffer.copyFromChannel !== 'function') {
                    wrapAudioBufferCopyChannelMethods(audioBuffer);
                // Bug #42: Firefox does not yet fully support copyFromChannel() and copyToChannel().
                } else if (!isSupportingCopyChannelMethodsSubarray(audioBuffer)) {
                    wrapAudioBufferCopyChannelMethodsSubarray(audioBuffer);
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
