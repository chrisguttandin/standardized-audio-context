import { getNativeContext } from '../helpers/get-native-context';
import { IChannelMergerOptions } from '../interfaces';
import { TChannelCountMode, TChannelInterpretation, TChannelMergerNodeConstructorFactory, TContext } from '../types';

const DEFAULT_OPTIONS: IChannelMergerOptions = {
    channelCount: 1,
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    numberOfInputs: 6
};

export const createChannelMergerNodeConstructor: TChannelMergerNodeConstructorFactory = (
    createChannelMergerNodeRenderer,
    createNativeChannelMergerNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class ChannelMergerNode extends noneAudioDestinationNodeConstructor {

        constructor (context: TContext, options: Partial<IChannelMergerOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IChannelMergerOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeChannelMergerNode = createNativeChannelMergerNode(nativeContext, mergedOptions);
            const channelMergerNodeRenderer = (isNativeOfflineAudioContext(nativeContext)) ? createChannelMergerNodeRenderer() : null;

            super(context, nativeChannelMergerNode, channelMergerNodeRenderer);
        }

    };

};
