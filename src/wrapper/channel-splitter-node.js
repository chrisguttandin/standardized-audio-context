import { Inject } from '@angular/core';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';

export class ChannelSplitterNodeWrapper {

    constructor (invalidStateErrorFactory) {
        this._invalidStateErrorFactory = invalidStateErrorFactory;
    }

    wrap (channelSplitterNode) {
        channelSplitterNode.channelCountMode = 'explicit';
        channelSplitterNode.channelInterpretation = 'discrete';

        Object.defineProperty(channelSplitterNode, 'channelCountMode', {
            get: () => 'explicit',
            set: () => {
                throw this._invalidStateErrorFactory.create();
            }
        });

        Object.defineProperty(channelSplitterNode, 'channelInterpretation', {
            get: () => 'discrete',
            set: () => {
                throw this._invalidStateErrorFactory.create();
            }
        });

        return channelSplitterNode;
    }

}

ChannelSplitterNodeWrapper.parameters = [ [ new Inject(InvalidStateErrorFactory) ] ];
