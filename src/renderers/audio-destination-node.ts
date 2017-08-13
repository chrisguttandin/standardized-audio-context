import { IAudioDestinationNode, IAudioNodeRenderer } from '../interfaces';
import { TNativeAudioDestinationNode, TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class AudioDestinationNodeRenderer extends AudioNodeRenderer implements IAudioNodeRenderer {

    private _node: null | TNativeAudioDestinationNode;

    private _proxy: IAudioDestinationNode;

    constructor (proxy: IAudioDestinationNode) {
        super();

        this._node = null;
        this._proxy = proxy;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        this._node = offlineAudioContext.destination;

        return this
            ._connectSources(offlineAudioContext, <TNativeAudioNode> this._node)
            .then(() => <TNativeAudioNode> this._node);
    }

}
