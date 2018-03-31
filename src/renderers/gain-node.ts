import { connectAudioParam } from '../helpers/connect-audio-param';
import { createNativeGainNode } from '../helpers/create-native-gain-node';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { IGainNode } from '../interfaces';
import { TNativeAudioNode, TNativeGainNode, TUnpatchedOfflineAudioContext } from '../types';
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
            this._nativeNode = createNativeGainNode(offlineAudioContext);

            await renderAutomation(offlineAudioContext, this._proxy.gain, this._nativeNode.gain);
        } else {
            await connectAudioParam(offlineAudioContext, this._proxy.gain);
        }

        await this._connectSources(offlineAudioContext, this._nativeNode);

        return this._nativeNode;
    }

}
