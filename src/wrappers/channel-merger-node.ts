import { Injectable } from '@angular/core';
import { createInvalidStateError } from '../factories/invalid-state-error';
import { TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

@Injectable()
export class ChannelMergerNodeWrapper {

    public wrap (audioContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, channelMergerNode: ChannelMergerNode) {
        const audioBufferSourceNode = audioContext.createBufferSource();

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
    }

}

export const CHANNEL_MERGER_NODE_WRAPPER_PROVIDER = { deps: [ ], provide: ChannelMergerNodeWrapper };
