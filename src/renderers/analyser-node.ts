import { createNativeAnalyserNode } from '../helpers/create-native-analyser-node';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAnalyserNode } from '../interfaces';
import { TNativeAnalyserNode, TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class AnalyserNodeRenderer extends AudioNodeRenderer {

    private _nativeNode: null | TNativeAnalyserNode;

    private _proxy: IAnalyserNode;

    constructor (proxy: IAnalyserNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
    }

    public async render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return this._nativeNode;
        }

        this._nativeNode = <TNativeAnalyserNode> getNativeNode(this._proxy);

        // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
        if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
            this._nativeNode = createNativeAnalyserNode(offlineAudioContext);
        }

        await this._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode);

        return <TNativeAudioNode> this._nativeNode;
    }

}
