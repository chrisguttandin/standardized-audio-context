import { TIsNativeContextFactory, TNativeAudioContext } from '../types';

export const createIsNativeContext: TIsNativeContextFactory = (isNativeAudioContext, isNativeOfflineAudioContext) => {
    return (anyContext): anyContext is TNativeAudioContext => {
        return (isNativeAudioContext(anyContext) || isNativeOfflineAudioContext(anyContext));
    };
};
