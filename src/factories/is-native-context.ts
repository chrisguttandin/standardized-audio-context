import { TIsNativeContextFactory, TNativeAudioContext } from '../types';

export const createIsNativeContext: TIsNativeContextFactory = (isNativeOfflineAudioContext, nativeAudioContextConstructor) => {
    return (anyContext): anyContext is TNativeAudioContext => {
        if (nativeAudioContextConstructor === null) {
            throw new Error('The native AudioContext constructor is missing.');
        }

        return (anyContext instanceof nativeAudioContextConstructor || isNativeOfflineAudioContext(anyContext));
    };
};
