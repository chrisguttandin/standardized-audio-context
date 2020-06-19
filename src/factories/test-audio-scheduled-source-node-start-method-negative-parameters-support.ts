import { TTestAudioScheduledSourceNodeStartMethodConsecutiveCallsSupportFactory } from '../types';

export const createTestAudioScheduledSourceNodeStartMethodNegativeParametersSupport: TTestAudioScheduledSourceNodeStartMethodConsecutiveCallsSupportFactory = (
    createNativeAudioNode
) => {
    return (nativeContext) => {
        const nativeAudioBufferSourceNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createOscillator());

        try {
            nativeAudioBufferSourceNode.start(-1);
        } catch (err) {
            return err instanceof RangeError;
        }

        return false;
    };
};
