import { TTestAudioContextDecodeAudioDataMethodTypeErrorSupportFactory } from '../types';

/**
 * Edge up to version 14, Firefox up to version 52, Safari up to version 9 and maybe other browsers
 * did not refuse to decode invalid parameters with a TypeError.
 */
export const createTestAudioContextDecodeAudioDataMethodTypeErrorSupport: TTestAudioContextDecodeAudioDataMethodTypeErrorSupportFactory = (
    unpatchedOfflineAudioContextConstructor
) => {
    return () => {
        if (unpatchedOfflineAudioContextConstructor === null) {
            return Promise.resolve(false);
        }

        const offlineAudioContext = new unpatchedOfflineAudioContextConstructor(1, 1, 44100);

        // Bug #21: Safari does not support promises yet.
        return new Promise((resolve) => {
            offlineAudioContext
                // Bug #1: Safari requires a successCallback.
                .decodeAudioData(<any> null, () => {
                    // Ignore the success callback.
                }, (err) => {
                    offlineAudioContext.startRendering();

                    resolve(err instanceof TypeError);
                })
                .catch(() => {
                    // Ignore errors.
                });
        });
    };
};
