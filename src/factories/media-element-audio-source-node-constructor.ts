import { getNativeContext } from '../helpers/get-native-context';
import { IMediaElementAudioSourceNode, IMediaElementAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TAudioNodeRenderer, TMediaElementAudioSourceNodeConstructorFactory, TNativeMediaElementAudioSourceNode } from '../types';

export const createMediaElementAudioSourceNodeConstructor: TMediaElementAudioSourceNodeConstructorFactory = (
    createNativeMediaElementAudioSourceNode,
    createNotSupportedError,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class MediaElementAudioSourceNode<T extends IMinimalAudioContext>
            extends noneAudioDestinationNodeConstructor<T>
            implements IMediaElementAudioSourceNode<T> {

        private _mediaElement: HTMLMediaElement;

        private _nativeMediaElementAudioSourceNode: TNativeMediaElementAudioSourceNode;

        constructor (context: T, options: IMediaElementAudioSourceOptions) {
            const nativeContext = getNativeContext(context);

            if (isNativeOfflineAudioContext(nativeContext)) {
                throw createNotSupportedError();
            }

            const nativeMediaElementAudioSourceNode = createNativeMediaElementAudioSourceNode(nativeContext, options);

            super(context, 'active', nativeMediaElementAudioSourceNode, <TAudioNodeRenderer<T>> null);

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
