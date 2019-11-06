import { IMediaStreamTrackAudioSourceNode, IMediaStreamTrackAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TAudioNodeRenderer, TMediaStreamTrackAudioSourceNodeConstructorFactory } from '../types';

export const createMediaStreamTrackAudioSourceNodeConstructor: TMediaStreamTrackAudioSourceNodeConstructorFactory = (
    audioNodeConstructor,
    createNativeMediaStreamTrackAudioSourceNode,
    createNotSupportedError,
    getNativeContext,
    isNativeOfflineAudioContext
) => {

    return class MediaStreamTrackAudioSourceNode<T extends IMinimalAudioContext>
            extends audioNodeConstructor<T>
            implements IMediaStreamTrackAudioSourceNode<T> {

        constructor (context: T, options: IMediaStreamTrackAudioSourceOptions) {
            const nativeContext = getNativeContext(context);

            if (isNativeOfflineAudioContext(nativeContext)) {
                throw createNotSupportedError();
            }

            const nativeMediaStreamTrackAudioSourceNode = createNativeMediaStreamTrackAudioSourceNode(nativeContext, options);

            super(context, true, nativeMediaStreamTrackAudioSourceNode, <TAudioNodeRenderer<T>> null);
        }

    };

};
