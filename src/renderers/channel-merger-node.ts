import { createNativeChannelMergerNode } from '../helpers/create-native-channel-merger-node';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioNode, IChannelMergerOptions } from '../interfaces';
import { TNativeAudioNode, TNativeChannelMergerNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class ChannelMergerNodeRenderer extends AudioNodeRenderer {

    private _nativeNode: null | TNativeChannelMergerNode;

    private _proxy: IAudioNode;

    constructor (proxy: IAudioNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
    }

    public async render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return this._nativeNode;
        }

        this._nativeNode = <TNativeChannelMergerNode> getNativeNode(this._proxy);

        // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
        if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
            const options: IChannelMergerOptions = {
                channelCount: this._nativeNode.channelCount,
                channelCountMode: this._nativeNode.channelCountMode,
                channelInterpretation: this._nativeNode.channelInterpretation,
                numberOfInputs: this._nativeNode.numberOfInputs
            };

            this._nativeNode = createNativeChannelMergerNode(offlineAudioContext, options);
        }

        await this._connectSources(offlineAudioContext, this._nativeNode);

        return this._nativeNode;
    }

}
