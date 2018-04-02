import { TNativeAudioWorkletNodeConstructorFactory } from '../types';

export const createNativeAudioWorkletNodeConstructor: TNativeAudioWorkletNodeConstructorFactory = (window) => {
    if (window === null) {
        return null;
    }

    return (window.hasOwnProperty('AudioWorkletNode')) ? (<any> window).AudioWorkletNode : null;
};
