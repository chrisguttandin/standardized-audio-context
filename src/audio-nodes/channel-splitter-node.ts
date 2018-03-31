import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeChannelSplitterNode } from '../helpers/create-native-channel-splitter-node';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IChannelSplitterOptions, IMinimalBaseAudioContext } from '../interfaces';
import { ChannelSplitterNodeRenderer } from '../renderers/channel-splitter-node';
import { TChannelCountMode, TChannelInterpretation, TNativeChannelSplitterNode } from '../types';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const DEFAULT_OPTIONS: IChannelSplitterOptions = {
    channelCount: 6,
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'discrete',
    numberOfOutputs: 6
};

const sanitizedOptions = (options: IChannelSplitterOptions) => {
    return { ...options, channelCount: options.numberOfOutputs };
};

export class ChannelSplitterNode extends NoneAudioDestinationNode<TNativeChannelSplitterNode> {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IChannelSplitterOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = sanitizedOptions(<IChannelSplitterOptions> { ...DEFAULT_OPTIONS, ...options });
        const nativeNode = createNativeChannelSplitterNode(nativeContext, mergedOptions);

        super(context, nativeNode, mergedOptions.channelCount);

        if (isOfflineAudioContext(nativeContext)) {
            const channelSplitterNodeRenderer = new ChannelSplitterNodeRenderer(this);

            AUDIO_NODE_RENDERER_STORE.set(this, channelSplitterNodeRenderer);
        }
    }

}
