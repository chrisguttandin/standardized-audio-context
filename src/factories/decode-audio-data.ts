import { detachArrayBuffer } from '../helpers/detach-array-buffer';
import { TDecodeAudioDataFactory } from '../types';

export const createDecodeAudioData: TDecodeAudioDataFactory = (
    audioBufferStore,
    createDataCloneError,
    detachedArrayBuffers,
    getNativeContext,
    isNativeContext
) => {
    return (anyContext, audioData) => {
        const nativeContext = isNativeContext(anyContext) ? anyContext : getNativeContext(anyContext);

        // Bug #43: Only Chrome throws a DataCloneError.
        if (detachedArrayBuffers.has(audioData)) {
            const err = createDataCloneError();

            return Promise.reject(err);
        }

        // The audioData parameter maybe of a type which can't be added to a WeakSet.
        try {
            detachedArrayBuffers.add(audioData);
        } catch {
            // Ignore errors.
        }

        return nativeContext.decodeAudioData(audioData).then((audioBuffer) => {
            // Bug #133: Safari does neuter the ArrayBuffer.
            detachArrayBuffer(audioData).catch(() => {
                // Ignore errors.
            });

            audioBufferStore.add(audioBuffer);

            return audioBuffer;
        });
    };
};
