import { getNativeContext } from '../helpers/get-native-context';
import { IChannelMergerOptions } from '../interfaces';
import { TChannelCountMode, TChannelInterpretation, TChannelMergerNodeConstructorFactory, TStandardizedContext } from '../types';

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

        constructor (context: TStandardizedContext, options: Partial<IChannelMergerOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IChannelMergerOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = createNativeChannelMergerNode(nativeContext, mergedOptions);
            const channelMergerNodeRenderer = (isNativeOfflineAudioContext(nativeContext)) ? createChannelMergerNodeRenderer() : null;

            super(context, nativeNode, channelMergerNodeRenderer);
        }

    };

};
