import { TTestAudioBufferSourceNodeStartMethodOffsetClampingSupportFactory } from '../types';

export const createTestAudioBufferSourceNodeStartMethodOffsetClampingSupport: TTestAudioBufferSourceNodeStartMethodOffsetClampingSupportFactory = (
    createNativeAudioNode
) => {
    return (nativeContext) => {
        const nativeAudioBufferSourceNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createBufferSource());
        const nativeAudioBuffer = nativeContext.createBuffer(1, 1, 44100);

        nativeAudioBufferSourceNode.buffer = nativeAudioBuffer;

        try {
            nativeAudioBufferSourceNode.start(0, 1);
        } catch {
            return false;
        }

        return true;
    };
};
