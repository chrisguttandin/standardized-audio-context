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

        private _mediaStream: MediaStream;

        private _nativeMediaStreamAudioSourceNode: TNativeMediaStreamAudioSourceNode;

        constructor (context: T, options: IMediaStreamAudioSourceOptions) {
            const nativeContext = getNativeContext(context);

            if (isNativeOfflineAudioContext(nativeContext)) {
                throw createNotSupportedError();
            }

            const mergedOptions = <IAudioNodeOptions & IMediaStreamAudioSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeMediaStreamAudioSourceNode = createNativeMediaStreamAudioSourceNode(nativeContext, mergedOptions);

            super(context, nativeMediaStreamAudioSourceNode, <TAudioNodeRenderer<T>> null);

            // Bug #63: Edge & Firefox do not expose the mediaStream yet.
            // Bug #151: The mediaStream gets cloned for Firefox but luckily it doesn't expose it at the same time.
            this._mediaStream = mergedOptions.mediaStream;
            this._nativeMediaStreamAudioSourceNode = nativeMediaStreamAudioSourceNode;
        }

        get mediaStream (): MediaStream {
            return (this._nativeMediaStreamAudioSourceNode.mediaStream === undefined) ?
                this._mediaStream :
                this._nativeMediaStreamAudioSourceNode.mediaStream;
        }

    };

};
