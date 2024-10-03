import { TTestOfflineAudioContextCurrentTimeSupportFactory } from '../types';

export const createTestOfflineAudioContextCurrentTimeSupport: TTestOfflineAudioContextCurrentTimeSupportFactory = (
    nativeOfflineAudioContextConstructor
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return Promise.resolve(false);
        }

        const nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);

        // Bug #21: Safari does not support promises yet.
        return new Promise((resolve) => {
            nativeOfflineAudioContext.oncomplete = () => {
                resolve(nativeOfflineAudioContext.currentTime !== 0);
            };
            nativeOfflineAudioContext.startRendering();
        });
    };
};
