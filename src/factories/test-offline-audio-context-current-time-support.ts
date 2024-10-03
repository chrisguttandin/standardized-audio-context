import { TTestOfflineAudioContextCurrentTimeSupportFactory } from '../types';

export const createTestOfflineAudioContextCurrentTimeSupport: TTestOfflineAudioContextCurrentTimeSupportFactory = (
    nativeOfflineAudioContextConstructor
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return Promise.resolve(false);
        }

        const nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);

        return nativeOfflineAudioContext.startRendering().then(() => nativeOfflineAudioContext.currentTime !== 0);
    };
};
