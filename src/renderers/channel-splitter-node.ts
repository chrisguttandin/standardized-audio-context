import { createNativeChannelSplitterNode } from '../helpers/create-native-channel-splitter-node';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioNode, IChannelSplitterOptions } from '../interfaces';
import { TNativeAudioNode, TNativeChannelSplitterNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class ChannelSplitterNodeRenderer extends AudioNodeRenderer {

    private _nativeNode: null | TNativeChannelSplitterNode;

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

        this._nativeNode = <TNativeChannelSplitterNode> getNativeNode(this._proxy);

        // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
        if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
            const options: IChannelSplitterOptions = {
                channelCount: this._nativeNode.channelCount,
                channelCountMode: this._nativeNode.channelCountMode,
                channelInterpretation: this._nativeNode.channelInterpretation,
                numberOfOutputs: this._nativeNode.numberOfOutputs
            };

            this._nativeNode = createNativeChannelSplitterNode(offlineAudioContext, options);
        }

        await this._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode);

        return <TNativeAudioNode> this._nativeNode;
    }

}
