import { TTestAudioBufferSourceNodeStopMethodNullifiedBufferSupportFactory } from '../types';

export const createTestAudioBufferSourceNodeStopMethodNullifiedBufferSupport: TTestAudioBufferSourceNodeStopMethodNullifiedBufferSupportFactory = (
    createNativeAudioNode
) => {
    return (nativeContext) => {
        const nativeAudioBufferSourceNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createBufferSource());

        nativeAudioBufferSourceNode.start();

        try {
            nativeAudioBufferSourceNode.stop();
        } catch {
            return false;
        }

        return true;
    };
};
