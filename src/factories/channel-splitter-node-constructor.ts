import { getNativeContext } from '../helpers/get-native-context';
import { IChannelSplitterOptions } from '../interfaces';
import { TChannelCountMode, TChannelInterpretation, TChannelSplitterNodeConstructorFactory, TStandardizedContext } from '../types';

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
    createChannelSplitterNodeRenderer,
    createNativeChannelSplitterNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class ChannelSplitterNode extends noneAudioDestinationNodeConstructor {

        constructor (context: TStandardizedContext, options: Partial<IChannelSplitterOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = sanitizedOptions(<IChannelSplitterOptions> { ...DEFAULT_OPTIONS, ...options });
            const nativeNode = createNativeChannelSplitterNode(nativeContext, mergedOptions);
            const channelSplitterNodeRenderer = (isNativeOfflineAudioContext(nativeContext)) ? createChannelSplitterNodeRenderer() : null;

            super(context, nativeNode, channelSplitterNodeRenderer);
        }

    };

};
