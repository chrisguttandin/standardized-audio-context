import { TNativeOfflineAudioContextConstructorFactory } from '../types';

export const createNativeOfflineAudioContextConstructor: TNativeOfflineAudioContextConstructorFactory = (window) => {
    if (window !== null && 'OfflineAudioContext' in window) {
        return window.OfflineAudioContext;
    }

    return null;
};
