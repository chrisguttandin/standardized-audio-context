import { TTestAudioScheduledSourceNodeStopMethodConsecutiveCallsSupportFactory } from '../types';

export const createTestAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport: TTestAudioScheduledSourceNodeStopMethodConsecutiveCallsSupportFactory = (
    createNativeAudioNode
) => {
    return (nativeContext) => {
        const nativeAudioBuffer = nativeContext.createBuffer(1, 1, 44100);
        const nativeAudioBufferSourceNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createBufferSource());

        nativeAudioBufferSourceNode.buffer = nativeAudioBuffer;
        nativeAudioBufferSourceNode.start();
        nativeAudioBufferSourceNode.stop();

        try {
            nativeAudioBufferSourceNode.stop();

            return true;
        } catch {
            return false;
        }
    };
};
