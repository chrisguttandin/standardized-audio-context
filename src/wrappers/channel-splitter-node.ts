import { createInvalidStateError } from '../factories/invalid-state-error';

export const wrapChannelSplitterNode = (channelSplitterNode: ChannelSplitterNode): void => {
    channelSplitterNode.channelCountMode = 'explicit';
    channelSplitterNode.channelInterpretation = 'discrete';

    const channelCount = channelSplitterNode.numberOfOutputs;

    Object.defineProperty(channelSplitterNode, 'channelCount', {
        get: () => channelCount,
        set: () => {
            throw createInvalidStateError();
        }
    });

    Object.defineProperty(channelSplitterNode, 'channelCountMode', {
        get: () => 'explicit',
        set: () => {
            throw createInvalidStateError();
        }
    });

    // Bug #31: Only Chrome & Opera have the correct channelInterpretation.
    Object.defineProperty(channelSplitterNode, 'channelInterpretation', {
        get: () => 'discrete',
        set: () => {
            throw createInvalidStateError();
        }
    });
};
