import { TConnectedNativeAudioBufferSourceNodeFactoryFactory } from '../types';

export const createConnectedNativeAudioBufferSourceNodeFactory: TConnectedNativeAudioBufferSourceNodeFactoryFactory = (
    createNativeAudioBufferSourceNode
) => {
    return (nativeContext, nativeAudioNode) => {
        const nativeAudioBufferSourceNode = createNativeAudioBufferSourceNode(nativeContext);
        const nativeAudioBuffer = nativeContext.createBuffer(1, 2, nativeContext.sampleRate);

        nativeAudioBufferSourceNode.buffer = nativeAudioBuffer;
        nativeAudioBufferSourceNode.loop = true;

        nativeAudioBufferSourceNode.connect(nativeAudioNode);
        nativeAudioBufferSourceNode.start();

        return () => {
            nativeAudioBufferSourceNode.stop();
            nativeAudioBufferSourceNode.disconnect(nativeAudioNode);
        };
    };
};
