import { Injectable } from '@angular/core';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';

@Injectable()
export class ChannelSplitterNodeWrapper {

    constructor (private _invalidStateErrorFactory: InvalidStateErrorFactory) { }

    public wrap (channelSplitterNode: ChannelSplitterNode) {
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
    }

}
