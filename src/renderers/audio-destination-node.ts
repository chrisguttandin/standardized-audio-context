import { IAudioDestinationNode, IAudioNodeRenderer } from '../interfaces';
import { TNativeAudioDestinationNode, TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class AudioDestinationNodeRenderer extends AudioNodeRenderer implements IAudioNodeRenderer {

    private _nativeNode: null | TNativeAudioDestinationNode;

    private _proxy: IAudioDestinationNode;

    constructor (proxy: IAudioDestinationNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return Promise.resolve(this._nativeNode);
        }

        this._nativeNode = offlineAudioContext.destination;

        return this
            ._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode)
            .then(() => <TNativeAudioNode> this._nativeNode);
    }

}
