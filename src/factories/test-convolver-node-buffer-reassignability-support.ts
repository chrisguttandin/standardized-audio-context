import { TTestConvolverNodeBufferReassignabilitySupportFactory } from '../types';

export const createTestConvolverNodeBufferReassignabilitySupport:
    TTestConvolverNodeBufferReassignabilitySupportFactory =
(
    createNativeAudioNode
) => {
    return (nativeContext) => {
        const nativeConvolverNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createConvolver());

        nativeConvolverNode.buffer = nativeContext.createBuffer(1, 1, nativeContext.sampleRate);

        try {
            nativeConvolverNode.buffer = nativeContext.createBuffer(1, 1, nativeContext.sampleRate);
        } catch {
            return false;
        }

        return true;
    };
};
