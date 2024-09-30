import { IAudioContext, IMediaStreamAudioSourceNode, IMediaStreamAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TAudioNodeRenderer, TMediaStreamAudioSourceNodeConstructorFactory, TNativeMediaStreamAudioSourceNode } from '../types';

export const createMediaStreamAudioSourceNodeConstructor: TMediaStreamAudioSourceNodeConstructorFactory = (
    audioNodeConstructor,
    createNativeMediaStreamAudioSourceNode,
    getNativeContext
) => {
    return class MediaStreamAudioSourceNode<T extends IAudioContext | IMinimalAudioContext>
        extends audioNodeConstructor<T>
        implements IMediaStreamAudioSourceNode<T>
    {
        private _nativeMediaStreamAudioSourceNode: TNativeMediaStreamAudioSourceNode;

        constructor(context: T, options: IMediaStreamAudioSourceOptions) {
            const nativeContext = getNativeContext(context);
            const nativeMediaStreamAudioSourceNode = createNativeMediaStreamAudioSourceNode(nativeContext, options);

            super(context, true, nativeMediaStreamAudioSourceNode, <TAudioNodeRenderer<T>>null);

            this._nativeMediaStreamAudioSourceNode = nativeMediaStreamAudioSourceNode;
        }

        get mediaStream(): MediaStream {
            return this._nativeMediaStreamAudioSourceNode.mediaStream;
        }
    };
};
