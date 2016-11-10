import { InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class ChannelMergerNodeWrapper {

    constructor (@Inject(InvalidStateErrorFactory) private _invalidStateErrorFactory) { }

    public wrap (audioContext, channelMergerNode) {
        const audioBufferSourceNode = audioContext.createBufferSource();

        channelMergerNode.channelCount = 1;
        channelMergerNode.channelCountMode = 'explicit';

        // Bug #20: Safari requires a connection of any kind to treat the input signal correctly.
        for (let i = 0, length = channelMergerNode.numberOfInputs; i < length; i += 1) {
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

        return channelMergerNode;
    }

}
