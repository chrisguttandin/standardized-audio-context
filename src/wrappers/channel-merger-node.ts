import { Inject, Injectable } from '@angular/core';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';

@Injectable()
export class ChannelMergerNodeWrapper {

    constructor (@Inject(InvalidStateErrorFactory) private _invalidStateErrorFactory) { }

    public wrap (audioContext, channelMergerNode) {
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
