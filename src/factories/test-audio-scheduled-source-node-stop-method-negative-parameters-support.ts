import { TTestAudioScheduledSourceNodeStopMethodNegativeParametersSupportFactory } from '../types';

export const createTestAudioScheduledSourceNodeStopMethodNegativeParametersSupport: TTestAudioScheduledSourceNodeStopMethodNegativeParametersSupportFactory = (
    createNativeAudioNode
) => {
    return (nativeContext) => {
        const nativeAudioBufferSourceNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createOscillator());

        try {
            nativeAudioBufferSourceNode.stop(-1);
        } catch (err) {
            return err instanceof RangeError;
        }

        return false;
    };
};
