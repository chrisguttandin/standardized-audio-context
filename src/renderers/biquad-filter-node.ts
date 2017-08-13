import { IAudioNodeRenderer, IBiquadFilterNode } from '../interfaces';
import { TNativeAudioNode, TNativeBiquadFilterNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class BiquadFilterNodeRenderer extends AudioNodeRenderer implements IAudioNodeRenderer {

    private _node: null | TNativeBiquadFilterNode;

    private _proxy: IBiquadFilterNode;

    constructor (proxy: IBiquadFilterNode) {
        super();

        this._node = null;
        this._proxy = proxy;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        this._node = offlineAudioContext.createBiquadFilter();
        this._node.type = this._proxy.type;

        return this
            ._connectSources(offlineAudioContext, <TNativeAudioNode> this._node)
            .then(() => <TNativeAudioNode> this._node);
    }

}
