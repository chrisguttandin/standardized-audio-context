import { Injectable } from '@angular/core';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { TUnpatchedAudioContext } from '../types';

@Injectable()
export class ChannelMergerNodeWrapper {

    constructor (private _invalidStateErrorFactory: InvalidStateErrorFactory) { }

    public wrap (audioContext: TUnpatchedAudioContext, channelMergerNode: ChannelMergerNode) {
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
                throw this._invalidStateErrorFactory.create();
            }
        });

        Object.defineProperty(channelMergerNode, 'channelCountMode', {
            get: () => 'explicit',
            set: () => {
                throw this._invalidStateErrorFactory.create();
            }
        });
    }

}
