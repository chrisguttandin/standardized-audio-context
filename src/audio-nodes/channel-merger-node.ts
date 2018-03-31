import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeChannelMergerNode } from '../helpers/create-native-channel-merger-node';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IChannelMergerOptions, IMinimalBaseAudioContext } from '../interfaces';
import { ChannelMergerNodeRenderer } from '../renderers/channel-merger-node';
import { TChannelCountMode, TChannelInterpretation, TNativeChannelMergerNode } from '../types';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IChannelMergerOptions = {
    channelCount: 1,
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    numberOfInputs: 6
};

export class ChannelMergerNode extends NoneAudioDestinationNode<TNativeChannelMergerNode> {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IChannelMergerOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IChannelMergerOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeChannelMergerNode(nativeContext, mergedOptions);

        super(context, nativeNode, mergedOptions.channelCount);

        if (isOfflineAudioContext(nativeContext)) {
            const channelMergerNodeRenderer = new ChannelMergerNodeRenderer(this);

            AUDIO_NODE_RENDERER_STORE.set(this, channelMergerNodeRenderer);
        }
    }

}
