import { IAudioNodeRenderer, IGainNode } from '../interfaces';
import { TNativeAudioNode, TNativeGainNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class GainNodeRenderer extends AudioNodeRenderer implements IAudioNodeRenderer {

    private _nativeNode: null | TNativeGainNode;

    private _proxy: IGainNode;

    constructor (proxy: IGainNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return Promise.resolve(this._nativeNode);
        }

        this._nativeNode = offlineAudioContext.createGain();

        return this
            ._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode)
            .then(() => <TNativeAudioNode> this._nativeNode);
    }

}
