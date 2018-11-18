import { TNativeAudioWorkletNodeConstructorFactory } from '../types';

export const createNativeAudioWorkletNodeConstructor: TNativeAudioWorkletNodeConstructorFactory = (window) => {
    if (window === null) {
        return null;
    }

    // @todo TypeScript doesn't know yet about the AudioWorkletNode constructor.
    return (window.hasOwnProperty('AudioWorkletNode')) ? (<any> window).AudioWorkletNode : null;
};
