import { TWrapChannelMergerNodeFactory } from '../types';

export const createWrapChannelMergerNode: TWrapChannelMergerNodeFactory = (monitorConnections) => {
    return (nativeContext, channelMergerNode) => {
        // Bug #20: Safari requires a connection of any kind to treat the input signal correctly.
        const audioBufferSourceNode = nativeContext.createBufferSource();

        const whenConnected = () => {
            const length = channelMergerNode.numberOfInputs;

            for (let i = 0; i < length; i += 1) {
                audioBufferSourceNode.connect(channelMergerNode, 0, i);
            }
        };
        const whenDisconnected = () => audioBufferSourceNode.disconnect(channelMergerNode);

        monitorConnections(channelMergerNode, whenConnected, whenDisconnected);
    };
};
