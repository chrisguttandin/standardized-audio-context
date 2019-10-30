import { TWrapChannelMergerNodeFactory } from '../types';

export const createWrapChannelMergerNode: TWrapChannelMergerNodeFactory = (
    createInvalidStateError,
    createNativeAudioNode,
    monitorConnectionsFunction
) => {
    return (nativeContext, channelMergerNode) => {
        channelMergerNode.channelCount = 1;
        channelMergerNode.channelCountMode = 'explicit';

        Object.defineProperty(channelMergerNode, 'channelCount', {
            get: () => 1,
            set: () => {
                throw createInvalidStateError();
            }
        });

        Object.defineProperty(channelMergerNode, 'channelCountMode', {
            get: () => 'explicit',
            set: () => {
                throw createInvalidStateError();
            }
        });

        // Bug #20: Safari requires a connection of any kind to treat the input signal correctly.
        const audioBufferSourceNode = createNativeAudioNode(nativeContext, (ntvCntxt) => ntvCntxt.createBufferSource());

        const whenConnected = () => {
            const length = channelMergerNode.numberOfInputs;

            for (let i = 0; i < length; i += 1) {
                audioBufferSourceNode.connect(channelMergerNode, 0, i);
            }
        };
        const whenDisconnected = () => audioBufferSourceNode.disconnect(channelMergerNode);

        monitorConnectionsFunction(channelMergerNode, whenConnected, whenDisconnected);
    };
};
