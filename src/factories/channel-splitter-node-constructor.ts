import { IChannelSplitterOptions } from '../interfaces';
import { TAudioNodeRenderer, TChannelSplitterNodeConstructorFactory, TContext } from '../types';

const DEFAULT_OPTIONS = {
    channelCount: 6,
    channelCountMode: 'explicit',
    channelInterpretation: 'discrete',
    numberOfOutputs: 6
} as const;

const sanitizedOptions = (options: IChannelSplitterOptions) => {
    return { ...options, channelCount: options.numberOfOutputs };
};

export const createChannelSplitterNodeConstructor: TChannelSplitterNodeConstructorFactory = (
    audioNodeConstructor,
    createChannelSplitterNodeRenderer,
    createNativeChannelSplitterNode,
    getNativeContext,
    isNativeOfflineAudioContext
) => {
    return class ChannelSplitterNode<T extends TContext> extends audioNodeConstructor<T> {
        constructor(context: T, options: Partial<IChannelSplitterOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = sanitizedOptions({ ...DEFAULT_OPTIONS, ...options });
            const nativeChannelSplitterNode = createNativeChannelSplitterNode(nativeContext, mergedOptions);
            const channelSplitterNodeRenderer = <TAudioNodeRenderer<T, this>>(
                (isNativeOfflineAudioContext(nativeContext) ? createChannelSplitterNodeRenderer() : null)
            );

            super(context, false, nativeChannelSplitterNode, channelSplitterNodeRenderer);
        }
    };
};
