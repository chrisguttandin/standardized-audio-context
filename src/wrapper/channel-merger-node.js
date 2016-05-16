import { Inject } from '@angular/core/src/di/decorators';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';

export class ChannelMergerNodeWrapper {

    constructor (invalidStateErrorFactory) {
        this._invalidStateErrorFactory = invalidStateErrorFactory;
    }

    wrap (channelMergerNode) {
        channelMergerNode.channelCount = 1;
        channelMergerNode.channelCountMode = 'explicit';

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
