import { IAudioNodeRenderer, IGainNode } from '../interfaces';
import { TNativeAudioNode, TNativeGainNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class GainNodeRenderer extends AudioNodeRenderer implements IAudioNodeRenderer {

    private _node: null | TNativeGainNode;

    private _proxy: IGainNode;

    constructor (proxy: IGainNode) {
        super();

        this._node = null;
        this._proxy = proxy;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        this._node = offlineAudioContext.createGain();

        return this
            ._connectSources(offlineAudioContext, <TNativeAudioNode> this._node)
            .then(() => <TNativeAudioNode> this._node);
    }

}
