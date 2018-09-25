import { TNativeAudioBufferConstructorFactory } from '../types';

export const createNativeAudioBufferConstructor: TNativeAudioBufferConstructorFactory = (window) => {
    if (window === null) {
        return null;
    }

    if (window.hasOwnProperty('AudioBuffer')) {
        // @todo TypeScript doesn't know yet about the AudioBuffer constructor.
        return (<any> window).AudioBuffer;
    }

    return null;
};
