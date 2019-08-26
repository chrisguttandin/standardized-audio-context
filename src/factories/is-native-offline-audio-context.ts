import { TIsNativeOfflineAudioContextFactory, TNativeOfflineAudioContext } from '../types';

export const createIsNativeOfflineAudioContext: TIsNativeOfflineAudioContextFactory = (nativeOfflineAudioContextConstructor) => {
    return (anyContext): anyContext is TNativeOfflineAudioContext => {
        return (nativeOfflineAudioContextConstructor !== null && anyContext instanceof nativeOfflineAudioContextConstructor);
    };
};
