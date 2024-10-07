import { TNativeAudioContextConstructorFactory } from '../types';

export const createNativeAudioContextConstructor: TNativeAudioContextConstructorFactory = (window) => {
    if (window !== null && 'AudioContext' in window) {
        return window.AudioContext;
    }

    return null;
};
