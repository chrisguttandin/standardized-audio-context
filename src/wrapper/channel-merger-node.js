import { Inject } from '@angular/core/src/di/decorators';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';

export class ChannelMergerNodeWrapper {

    constructor (invalidStateErrorFactory) {
        this._invalidStateErrorFactory = invalidStateErrorFactory;
    }

    wrap (audioContext, channelMergerNode) {
        var audioBufferSourceNode = audioContext.createBufferSource();

        channelMergerNode.channelCount = 1;
        channelMergerNode.channelCountMode = 'explicit';

        // bug #20: Safari requires a connection of any kind to treat the input signal correctly.
        for (let i = 0, length = channelMergerNode.numberOfInputs; i < length; i += 1) {
            audioBufferSourceNode.connect(channelMergerNode, 0, i);
        }

        Object.defineProperty(channelMergerNode, 'channelCount', {
            get: () => 1,
            set: () => {
                throw this._invalidStateErrorFactory.create()
            }
        });

        Object.defineProperty(channelMergerNode, 'channelCountMode', {
            get: () => 'explicit',
            set: () => {
                throw this._invalidStateErrorFactory.create()
            }
        });

        return channelMergerNode;
    }

}

ChannelMergerNodeWrapper.parameters = [ [ new Inject(InvalidStateErrorFactory) ] ];
