import { getNativeContext } from '../helpers/get-native-context';
import { IAudioNodeOptions, IMediaStreamAudioSourceNode, IMediaStreamAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TMediaStreamAudioSourceNodeConstructorFactory,
    TNativeMediaStreamAudioSourceNode
} from '../types';

const DEFAULT_OPTIONS: IAudioNodeOptions = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers'
};

export const createMediaStreamAudioSourceNodeConstructor: TMediaStreamAudioSourceNodeConstructorFactory = (
    noneAudioDestinationNodeConstructor
) => {

    return class MediaStreamAudioSourceNode extends noneAudioDestinationNodeConstructor implements IMediaStreamAudioSourceNode {

        private _mediaStream: MediaStream;

        private _nativeMediaStreamAudioSourceNode: TNativeMediaStreamAudioSourceNode;

        constructor (context: IMinimalAudioContext, options: IMediaStreamAudioSourceOptions) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IAudioNodeOptions & IMediaStreamAudioSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeMediaStreamAudioSourceNode = nativeContext.createMediaStreamSource(mergedOptions.mediaStream);

            super(context, nativeMediaStreamAudioSourceNode, null);

            // Bug #63: Edge & Firefox do not expose the mediaStream yet.
            this._mediaStream = mergedOptions.mediaStream;
            this._nativeMediaStreamAudioSourceNode = nativeMediaStreamAudioSourceNode;
        }

        public get mediaStream () {
            return (this._nativeMediaStreamAudioSourceNode.mediaStream === undefined) ?
                this._mediaStream :
                this._nativeMediaStreamAudioSourceNode.mediaStream;
        }

    };

};
