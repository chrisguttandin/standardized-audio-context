import { createInvalidStateError } from '../factories/invalid-state-error';
import { TNativeContext } from '../types';

export const wrapChannelMergerNode = (nativeContext: TNativeContext, channelMergerNode: ChannelMergerNode): void => {
    const audioBufferSourceNode = nativeContext.createBufferSource();

    channelMergerNode.channelCount = 1;
    channelMergerNode.channelCountMode = 'explicit';

    // Bug #20: Safari requires a connection of any kind to treat the input signal correctly.
    const length = channelMergerNode.numberOfInputs;

    for (let i = 0; i < length; i += 1) {
        audioBufferSourceNode.connect(channelMergerNode, 0, i);
    }

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
};
