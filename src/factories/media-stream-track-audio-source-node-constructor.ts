import { getNativeContext } from '../helpers/get-native-context';
import { IMediaStreamTrackAudioSourceNode, IMediaStreamTrackAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TAudioNodeRenderer, TMediaStreamTrackAudioSourceNodeConstructorFactory } from '../types';

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

            const nativeMediaStreamTrackAudioSourceNode = createNativeMediaStreamTrackAudioSourceNode(nativeContext, options);

            super(context, 'active', nativeMediaStreamTrackAudioSourceNode, <TAudioNodeRenderer<T>> null);
        }

    };

};
