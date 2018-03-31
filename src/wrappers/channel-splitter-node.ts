import { Injectable } from '@angular/core';
import { createInvalidStateError } from '../factories/invalid-state-error';

@Injectable()
export class ChannelSplitterNodeWrapper {

    public wrap (channelSplitterNode: ChannelSplitterNode) {
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
    }

}

export const CHANNEL_SPLITTER_NODE_WRAPPER_PROVIDER = { deps: [ ], provide: ChannelSplitterNodeWrapper };
