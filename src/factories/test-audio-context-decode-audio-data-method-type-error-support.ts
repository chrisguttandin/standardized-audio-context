import { TTestAudioContextDecodeAudioDataMethodTypeErrorSupportFactory } from '../types';

/**
 * Edge up to version 14, Firefox up to version 52, Safari up to version 9 and maybe other browsers
 * did not refuse to decode invalid parameters with a TypeError.
 */
export const createTestAudioContextDecodeAudioDataMethodTypeErrorSupport: TTestAudioContextDecodeAudioDataMethodTypeErrorSupportFactory = (
    nativeOfflineAudioContextConstructor
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return Promise.resolve(false);
        }

        const offlineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);

        // Bug #21: Safari up to version 13.1 return no promise.
        return new Promise((resolve) => {
            let isPending = true;

            const resolvePromise = (err: Error) => {
                if (isPending) {
                    isPending = false;

                    offlineAudioContext.startRendering();

                    resolve(err instanceof TypeError);
                }
            };

            const promise = offlineAudioContext
                // Bug #1: Safari up to version 13.1 required a successCallback.
                .decodeAudioData(
                    <any>null,
                    () => {
                        // Ignore the success callback.
                    },
                    resolvePromise
                );

            // Bug #21: Safari up to version 13.1 return no promise.
            if (promise !== undefined) {
                // Bug #6: Chrome and Firefox do not call the errorCallback.
                promise.catch(resolvePromise);
            }
        });
    };
};
