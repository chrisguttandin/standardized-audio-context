import { Inject } from 'angular2/src/core/di/decorators';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';

export class ChannelMergerNodeWrapper {

    constructor (invalidStateErrorFactory) {
        this._invalidStateErrorFactory = invalidStateErrorFactory;
    }

    wrap (channelMergerNode) {
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
