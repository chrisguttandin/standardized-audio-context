import { AUDIO_PARAM_STORE } from '../globals';
import { connectAudioParam } from '../helpers/connect-audio-param';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { IAudioParam, IGainNode } from '../interfaces';
import { TNativeAudioNode, TNativeAudioParam, TNativeGainNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class GainNodeRenderer extends AudioNodeRenderer {

    private _nativeNode: null | TNativeGainNode;

    private _proxy: IGainNode;

    constructor (proxy: IGainNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
    }

    public async render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return this._nativeNode;
        }

        this._nativeNode = <TNativeGainNode> getNativeNode(this._proxy);

        // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
        if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
            const gainAudioParam = <IAudioParam> (<any> this._nativeNode.gain);

            this._nativeNode = offlineAudioContext.createGain();

            await renderAutomation(offlineAudioContext, gainAudioParam, this._nativeNode.gain);
        } else {
            const nativeAudioParam = <TNativeAudioParam> AUDIO_PARAM_STORE.get(this._proxy.gain);

            await connectAudioParam(offlineAudioContext, <IAudioParam> (<any> this._nativeNode.gain), nativeAudioParam);
        }

        await this._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode);

        return <TNativeAudioNode> this._nativeNode;
    }

}
