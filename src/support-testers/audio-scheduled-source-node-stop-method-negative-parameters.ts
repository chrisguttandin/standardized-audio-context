import { TNativeContext } from '../types';

export const testAudioScheduledSourceNodeStopMethodNegativeParametersSupport = (nativeContext: TNativeContext): boolean => {
    const audioBuffer = nativeContext.createBufferSource();

    try {
        audioBuffer.stop(-1);
    } catch (err) {
        return (err instanceof RangeError);
    }

    return false;
};
