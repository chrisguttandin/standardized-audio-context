import { TIsNativeOfflineAudioContextFactory, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export const createIsNativeOfflineAudioContext: TIsNativeOfflineAudioContextFactory = (unpatchedOfflineAudioContextConstructor) => {
    return (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext): boolean => {
        if (unpatchedOfflineAudioContextConstructor === null) {
            throw new Error('The native OfflineAudioContext constructor is missing.');
        }

        return nativeContext instanceof unpatchedOfflineAudioContextConstructor;
    };
};
