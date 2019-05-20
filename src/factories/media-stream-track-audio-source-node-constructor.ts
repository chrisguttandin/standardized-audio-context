import { getNativeContext } from '../helpers/get-native-context';
import {
    IAudioNodeOptions,
    IMediaStreamTrackAudioSourceNode,
    IMediaStreamTrackAudioSourceOptions,
    IMinimalAudioContext
} from '../interfaces';
import { TAudioNodeRenderer, TMediaStreamTrackAudioSourceNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS: IAudioNodeOptions = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers'
};

export const createMediaStreamTrackAudioSourceNodeConstructor: TMediaStreamTrackAudioSourceNodeConstructorFactory = (
    createNativeMediaStreamTrackAudioSourceNode,
    createNotSupportedError,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class MediaStreamTrackAudioSourceNode<T extends IMinimalAudioContext>
            extends noneAudioDestinationNodeConstructor<T>
            implements IMediaStreamTrackAudioSourceNode<T> {

        constructor (context: T, options: IMediaStreamTrackAudioSourceOptions) {
            const nativeContext = getNativeContext(context);

            if (isNativeOfflineAudioContext(nativeContext)) {
                throw createNotSupportedError();
            }

            const mergedOptions = <IAudioNodeOptions & IMediaStreamTrackAudioSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeMediaStreamTrackAudioSourceNode = createNativeMediaStreamTrackAudioSourceNode(nativeContext, mergedOptions);

            super(context, 'active', nativeMediaStreamTrackAudioSourceNode, <TAudioNodeRenderer<T>> null);
        }

    };

};
