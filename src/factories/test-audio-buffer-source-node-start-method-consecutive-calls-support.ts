import { TTestAudioBufferSourceNodeStartMethodConsecutiveCallsSupportFactory } from '../types';

export const createTestAudioBufferSourceNodeStartMethodConsecutiveCallsSupport: TTestAudioBufferSourceNodeStartMethodConsecutiveCallsSupportFactory = (
    createNativeAudioNode
) => {
    return (nativeContext) => {
        const nativeAudioBufferSourceNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createBufferSource());

        nativeAudioBufferSourceNode.start();

        try {
            nativeAudioBufferSourceNode.start();
        } catch {
            return true;
        }

        return false;
    };
};
