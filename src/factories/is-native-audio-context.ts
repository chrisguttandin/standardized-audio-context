import { TIsNativeAudioContextFactory, TNativeAudioContext } from '../types';

export const createIsNativeAudioContext: TIsNativeAudioContextFactory = (nativeAudioContextConstructor) => {
    return (anyContext): anyContext is TNativeAudioContext => {
        return (nativeAudioContextConstructor !== null && anyContext instanceof nativeAudioContextConstructor);
    };
};
