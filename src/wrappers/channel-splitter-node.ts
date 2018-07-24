import { createInvalidStateError } from '../factories/invalid-state-error';
import { TNativeChannelSplitterNode } from '../types';

export const wrapChannelSplitterNode = (channelSplitterNode: TNativeChannelSplitterNode): void => {
    const channelCount = channelSplitterNode.numberOfOutputs;

    if (channelSplitterNode.channelCount !== channelCount) {
        try {
            channelSplitterNode.channelCount = channelCount;
        } catch (_) {
            // Bug #90: FirefoxDeveloper sets the wrong channelCount but does not allow to change it.
        }
    }

    if (channelSplitterNode.channelCountMode !== 'explicit') {
        try {
            channelSplitterNode.channelCountMode = 'explicit';
        } catch (_) {
            // Bug #29: Firefox sets the wrong channelCountMode but does not allow to change it.
        }
    }

    if (channelSplitterNode.channelInterpretation !== 'discrete') {
        try {
            channelSplitterNode.channelInterpretation = 'discrete';
        } catch (_) {
            // Bug #31: Firefox sets the wrong channelInterpretation but does not allow to change it.
        }
    }

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
