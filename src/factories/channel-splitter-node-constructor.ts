import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeChannelSplitterNode } from '../helpers/create-native-channel-splitter-node';
import { getNativeContext } from '../helpers/get-native-context';
import { IChannelSplitterOptions, IMinimalBaseAudioContext } from '../interfaces';
import { ChannelSplitterNodeRenderer } from '../renderers/channel-splitter-node';
import { TChannelCountMode, TChannelInterpretation, TChannelSplitterNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS: IChannelSplitterOptions = {
    channelCount: 6,
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'discrete',
    numberOfOutputs: 6
};

const sanitizedOptions = (options: IChannelSplitterOptions) => {
    return { ...options, channelCount: options.numberOfOutputs };
};

export const createChannelSplitterNodeConstructor: TChannelSplitterNodeConstructorFactory = (
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class ChannelSplitterNode extends noneAudioDestinationNodeConstructor {

        constructor (context: IMinimalBaseAudioContext, options: Partial<IChannelSplitterOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = sanitizedOptions(<IChannelSplitterOptions> { ...DEFAULT_OPTIONS, ...options });
            const nativeNode = createNativeChannelSplitterNode(nativeContext, mergedOptions);

            super(context, nativeNode);

            if (isNativeOfflineAudioContext(nativeContext)) {
                const channelSplitterNodeRenderer = new ChannelSplitterNodeRenderer(this);

                AUDIO_NODE_RENDERER_STORE.set(this, channelSplitterNodeRenderer);
            }
        }

    };

};
