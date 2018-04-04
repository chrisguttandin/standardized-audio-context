import { TIsNativeOfflineAudioContextFactory, TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const createIsNativeOfflineAudioContext: TIsNativeOfflineAudioContextFactory = (nativeOfflineAudioContextConstructor) => {
    return (nativeContext: TNativeAudioContext | TNativeOfflineAudioContext): boolean => {
        if (nativeOfflineAudioContextConstructor === null) {
            throw new Error('The native OfflineAudioContext constructor is missing.');
        }

        return nativeContext instanceof nativeOfflineAudioContextConstructor;
    };
};
