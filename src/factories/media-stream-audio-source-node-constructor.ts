import { getNativeContext } from '../helpers/get-native-context';
import { IMediaStreamAudioSourceNode, IMediaStreamAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TAudioNodeRenderer, TMediaStreamAudioSourceNodeConstructorFactory, TNativeMediaStreamAudioSourceNode } from '../types';

export const createMediaStreamAudioSourceNodeConstructor: TMediaStreamAudioSourceNodeConstructorFactory = (
    createNativeMediaStreamAudioSourceNode,
    createNotSupportedError,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class MediaStreamAudioSourceNode<T extends IMinimalAudioContext>
            extends noneAudioDestinationNodeConstructor<T>
            implements IMediaStreamAudioSourceNode<T> {

        private _nativeMediaStreamAudioSourceNode: TNativeMediaStreamAudioSourceNode;

        constructor (context: T, options: IMediaStreamAudioSourceOptions) {
            const nativeContext = getNativeContext(context);

            if (isNativeOfflineAudioContext(nativeContext)) {
                throw createNotSupportedError();
            }

            const nativeMediaStreamAudioSourceNode = createNativeMediaStreamAudioSourceNode(nativeContext, options);

            super(context, true, nativeMediaStreamAudioSourceNode, <TAudioNodeRenderer<T>> null);

            this._nativeMediaStreamAudioSourceNode = nativeMediaStreamAudioSourceNode;
        }

        get mediaStream (): MediaStream {
            return this._nativeMediaStreamAudioSourceNode.mediaStream;
        }

    };

};
