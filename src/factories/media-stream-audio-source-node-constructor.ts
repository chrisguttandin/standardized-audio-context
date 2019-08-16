import { getNativeContext } from '../helpers/get-native-context';
import { IAudioNodeOptions, IMediaStreamAudioSourceNode, IMediaStreamAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TAudioNodeRenderer, TMediaStreamAudioSourceNodeConstructorFactory, TNativeMediaStreamAudioSourceNode } from '../types';

const DEFAULT_OPTIONS: IAudioNodeOptions = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers'
};

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

            const mergedOptions = <IAudioNodeOptions & IMediaStreamAudioSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeMediaStreamAudioSourceNode = createNativeMediaStreamAudioSourceNode(nativeContext, mergedOptions);

            super(context, 'active', nativeMediaStreamAudioSourceNode, <TAudioNodeRenderer<T>> null);

            this._nativeMediaStreamAudioSourceNode = nativeMediaStreamAudioSourceNode;
        }

        get mediaStream (): MediaStream {
            return this._nativeMediaStreamAudioSourceNode.mediaStream;
        }

    };

};
