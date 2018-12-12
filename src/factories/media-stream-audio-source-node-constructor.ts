import { getNativeAudioContext } from '../helpers/get-native-audio-context';
import { IAudioNodeOptions, IMediaStreamAudioSourceNode, IMediaStreamAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TMediaStreamAudioSourceNodeConstructorFactory, TNativeMediaStreamAudioSourceNode } from '../types';

const DEFAULT_OPTIONS: IAudioNodeOptions = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers'
};

export const createMediaStreamAudioSourceNodeConstructor: TMediaStreamAudioSourceNodeConstructorFactory = (
    createNativeMediaStreamAudioSourceNode,
    noneAudioDestinationNodeConstructor
) => {

    return class MediaStreamAudioSourceNode extends noneAudioDestinationNodeConstructor implements IMediaStreamAudioSourceNode {

        private _mediaStream: MediaStream;

        private _nativeMediaStreamAudioSourceNode: TNativeMediaStreamAudioSourceNode;

        constructor (context: IMinimalAudioContext, options: IMediaStreamAudioSourceOptions) {
            const nativeContext = getNativeAudioContext(context);
            const mergedOptions = <IAudioNodeOptions & IMediaStreamAudioSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeMediaStreamAudioSourceNode = createNativeMediaStreamAudioSourceNode(nativeContext, mergedOptions);

            super(context, nativeMediaStreamAudioSourceNode, null);

            // Bug #63: Edge & Firefox do not expose the mediaStream yet.
            this._mediaStream = mergedOptions.mediaStream;
            this._nativeMediaStreamAudioSourceNode = nativeMediaStreamAudioSourceNode;
        }

        public get mediaStream (): MediaStream {
            return (this._nativeMediaStreamAudioSourceNode.mediaStream === undefined) ?
                this._mediaStream :
                this._nativeMediaStreamAudioSourceNode.mediaStream;
        }

    };

};
