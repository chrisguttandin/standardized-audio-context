import { IAudioNodeRenderer, IBiquadFilterNode } from '../interfaces';
import { TNativeAudioNode, TNativeBiquadFilterNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class BiquadFilterNodeRenderer extends AudioNodeRenderer implements IAudioNodeRenderer {

    private _nativeNode: null | TNativeBiquadFilterNode;

    private _proxy: IBiquadFilterNode;

    constructor (proxy: IBiquadFilterNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return Promise.resolve(this._nativeNode);
        }

        this._nativeNode = offlineAudioContext.createBiquadFilter();
        this._nativeNode.type = this._proxy.type;

        return this
            ._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode)
            .then(() => <TNativeAudioNode> this._nativeNode);
    }

}
