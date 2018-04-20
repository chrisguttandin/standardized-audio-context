import { TNativeContext } from '../types';

export const testAudioScheduledSourceNodeStartMethodNegativeParametersSupport = (nativeContext: TNativeContext): boolean => {
    const audioBuffer = nativeContext.createBufferSource();

    try {
        audioBuffer.start(-1);
    } catch (err) {
        return (err instanceof RangeError);
    }

    return false;
};
