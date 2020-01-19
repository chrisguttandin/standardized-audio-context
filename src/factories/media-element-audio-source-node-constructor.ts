import { IAudioContext, IMediaElementAudioSourceNode, IMediaElementAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TAudioNodeRenderer, TMediaElementAudioSourceNodeConstructorFactory, TNativeMediaElementAudioSourceNode } from '../types';

export const createMediaElementAudioSourceNodeConstructor: TMediaElementAudioSourceNodeConstructorFactory = (
    audioNodeConstructor,
    createNativeMediaElementAudioSourceNode,
    createNotSupportedError,
    getNativeContext,
    isNativeOfflineAudioContext
) => {

    return class MediaElementAudioSourceNode<T extends IAudioContext | IMinimalAudioContext>
            extends audioNodeConstructor<T>
            implements IMediaElementAudioSourceNode<T> {

        private _mediaElement: HTMLMediaElement;

        private _nativeMediaElementAudioSourceNode: TNativeMediaElementAudioSourceNode;

        constructor (context: T, options: IMediaElementAudioSourceOptions) {
            const nativeContext = getNativeContext(context);

            if (isNativeOfflineAudioContext(nativeContext)) {
                throw createNotSupportedError();
            }

            const nativeMediaElementAudioSourceNode = createNativeMediaElementAudioSourceNode(nativeContext, options);

            super(context, true, nativeMediaElementAudioSourceNode, <TAudioNodeRenderer<T>> null);

            // Bug #63: Edge & Firefox do not expose the mediaElement yet.
            this._mediaElement = options.mediaElement;
            this._nativeMediaElementAudioSourceNode = nativeMediaElementAudioSourceNode;
        }

        get mediaElement (): HTMLMediaElement {
            return (this._nativeMediaElementAudioSourceNode.mediaElement === undefined) ?
                this._mediaElement :
                this._nativeMediaElementAudioSourceNode.mediaElement;
        }

    };

};
