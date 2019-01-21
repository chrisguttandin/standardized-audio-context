import { TIsNativeOfflineAudioContextFactory, TNativeOfflineAudioContext } from '../types';

export const createIsNativeOfflineAudioContext: TIsNativeOfflineAudioContextFactory = (nativeOfflineAudioContextConstructor) => {
    return (anyContext): anyContext is TNativeOfflineAudioContext => {
        if (nativeOfflineAudioContextConstructor === null) {
            throw new Error('The native OfflineAudioContext constructor is missing.');
        }

        return anyContext instanceof nativeOfflineAudioContextConstructor;
    };
};
