import { IAudioContext, IMediaElementAudioSourceNode, IMediaElementAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TAudioNodeRenderer, TMediaElementAudioSourceNodeConstructorFactory, TNativeMediaElementAudioSourceNode } from '../types';

export const createMediaElementAudioSourceNodeConstructor: TMediaElementAudioSourceNodeConstructorFactory = (
    audioNodeConstructor,
    createNativeMediaElementAudioSourceNode,
    getNativeContext,
    isNativeOfflineAudioContext
) => {
    return class MediaElementAudioSourceNode<T extends IAudioContext | IMinimalAudioContext> extends audioNodeConstructor<T>
        implements IMediaElementAudioSourceNode<T> {
        private _mediaElement: HTMLMediaElement;

        private _nativeMediaElementAudioSourceNode: TNativeMediaElementAudioSourceNode;

        constructor(context: T, options: IMediaElementAudioSourceOptions) {
            const nativeContext = getNativeContext(context);
            const nativeMediaElementAudioSourceNode = createNativeMediaElementAudioSourceNode(nativeContext, options);

            // Bug #171: Safari allows to create a MediaElementAudioSourceNode with an OfflineAudioContext.
            if (isNativeOfflineAudioContext(nativeContext)) {
                throw TypeError();
            }

            super(context, true, nativeMediaElementAudioSourceNode, <TAudioNodeRenderer<T>>null);

            // Bug #63: Edge does not expose the mediaElement yet.
            this._mediaElement = options.mediaElement;
            this._nativeMediaElementAudioSourceNode = nativeMediaElementAudioSourceNode;
        }

        get mediaElement(): HTMLMediaElement {
            return this._nativeMediaElementAudioSourceNode.mediaElement === undefined
                ? this._mediaElement
                : this._nativeMediaElementAudioSourceNode.mediaElement;
        }
    };
};
