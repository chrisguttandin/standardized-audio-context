import { deallocate } from 'async-array-buffer';
import { DETACHED_ARRAY_BUFFERS } from '../globals';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getNativeContext } from '../helpers/get-native-context';
import { TDecodeAudioDataFactory } from '../types';
import { wrapAudioBufferCopyChannelMethods } from '../wrappers/audio-buffer-copy-channel-methods';
import { wrapAudioBufferCopyChannelMethodsSubarray } from '../wrappers/audio-buffer-copy-channel-methods-subarray';
import { wrapAudioBufferGetChannelDataMethod } from '../wrappers/audio-buffer-get-channel-data-method';

export const createDecodeAudioData: TDecodeAudioDataFactory = (
    createDataCloneError,
    createEncodingError,
    nativeOfflineAudioContextConstructor,
    isNativeContext,
    isNativeOfflineAudioContext,
    testAudioBufferCopyChannelMethodsSubarraySupport,
    testPromiseSupport
) => {
    return (anyContext, audioData) => {
        const nativeContext = isNativeContext(anyContext) ? anyContext : getNativeContext(anyContext);

        // Bug #43: Only Chrome and Opera do throw a DataCloneError.
        if (DETACHED_ARRAY_BUFFERS.has(audioData)) {
            const err = createDataCloneError();

            return Promise.reject(err);
        }

        // The audioData parameter maybe of a type which can't be added to a WeakSet.
        try {
            DETACHED_ARRAY_BUFFERS.add(audioData);
        } catch {
            // Ignore errors.
        }

        // Bug #21: Safari does not support promises yet.
        if (cacheTestResult(testPromiseSupport, () => testPromiseSupport(nativeContext))) {
            // Bug #101: Edge does not decode something on a closed OfflineAudioContext.
            const nativeContextOrBackupNativeContext = (nativeContext.state === 'closed' &&
                    nativeOfflineAudioContextConstructor !== null &&
                    isNativeOfflineAudioContext(nativeContext)) ?
                new nativeOfflineAudioContextConstructor(1, 1, nativeContext.sampleRate) :
                nativeContext;

            const promise = nativeContextOrBackupNativeContext
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
                } catch { /* Ignore errors. */ }
            });

            return promise
                .then((audioBuffer) => {
                    // Bug #42: Firefox does not yet fully support copyFromChannel() and copyToChannel().
                    if (!cacheTestResult(
                        testAudioBufferCopyChannelMethodsSubarraySupport,
                        () => testAudioBufferCopyChannelMethodsSubarraySupport(audioBuffer)
                    )) {
                        wrapAudioBufferCopyChannelMethodsSubarray(audioBuffer);
                    }

                    return audioBuffer;
                });
        }

        // Bug #21: Safari does not return a Promise yet.
        return new Promise((resolve, reject) => {
            const complete = () => {
                try {
                    deallocate(audioData);
                } catch { /* Ignore errors. */ }
            };

            const fail = (err: DOMException | Error) => {
                reject(err);
                complete();
            };

            // Bug #26: Safari throws a synchronous error.
            try {
                // Bug #1: Safari requires a successCallback.
                nativeContext.decodeAudioData(audioData, (audioBuffer: AudioBuffer) => {
                    // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
                    // Bug #100: Safari does throw a wrong error when calling getChannelData() with an out-of-bounds value.
                    if (typeof audioBuffer.copyFromChannel !== 'function') {
                        wrapAudioBufferCopyChannelMethods(audioBuffer);
                        wrapAudioBufferGetChannelDataMethod(audioBuffer);
                    }

                    resolve(audioBuffer);
                    complete();
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
};
