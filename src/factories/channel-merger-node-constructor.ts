import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { IChannelMergerOptions, IMinimalBaseAudioContext } from '../interfaces';
import { ChannelMergerNodeRenderer } from '../renderers/channel-merger-node';
import { TChannelCountMode, TChannelInterpretation, TChannelMergerNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS: IChannelMergerOptions = {
    channelCount: 1,
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    numberOfInputs: 6
};

export const createChannelMergerNodeConstructor: TChannelMergerNodeConstructorFactory = (
    createNativeChannelMergerNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class ChannelMergerNode extends noneAudioDestinationNodeConstructor {

        constructor (context: IMinimalBaseAudioContext, options: Partial<IChannelMergerOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IChannelMergerOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = createNativeChannelMergerNode(nativeContext, mergedOptions);

            super(context, nativeNode);

            if (isNativeOfflineAudioContext(nativeContext)) {
                const channelMergerNodeRenderer = new ChannelMergerNodeRenderer(this);

                AUDIO_NODE_RENDERER_STORE.set(this, channelMergerNodeRenderer);
            }
        }

    };

};
