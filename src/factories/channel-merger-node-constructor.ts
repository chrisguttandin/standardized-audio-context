import { IChannelMergerOptions, IMinimalBaseAudioContext } from '../interfaces';
import { TAudioNodeRenderer, TChannelMergerNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS = {
    channelCount: 1,
    channelCountMode: 'explicit',
    channelInterpretation: 'speakers',
    numberOfInputs: 6
} as const;

export const createChannelMergerNodeConstructor: TChannelMergerNodeConstructorFactory = (
    createChannelMergerNodeRenderer,
    createNativeChannelMergerNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class ChannelMergerNode<T extends IMinimalBaseAudioContext> extends noneAudioDestinationNodeConstructor<T> {

        constructor (context: T, options: Partial<IChannelMergerOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeChannelMergerNode = createNativeChannelMergerNode(nativeContext, mergedOptions);
            const channelMergerNodeRenderer = <TAudioNodeRenderer<T, this>> ((isNativeOfflineAudioContext(nativeContext))
                ? createChannelMergerNodeRenderer()
                : null);

            super(context, false, nativeChannelMergerNode, channelMergerNodeRenderer);
        }

    };

};
