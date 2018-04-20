import { TIsNativeOfflineAudioContextFactory, TNativeOfflineAudioContext } from '../types';

export const createIsNativeOfflineAudioContext: TIsNativeOfflineAudioContextFactory = (nativeOfflineAudioContextConstructor) => {
    return (nativeContext): nativeContext is TNativeOfflineAudioContext => {
        if (nativeOfflineAudioContextConstructor === null) {
            throw new Error('The native OfflineAudioContext constructor is missing.');
        }

        return nativeContext instanceof nativeOfflineAudioContextConstructor;
    };
};
