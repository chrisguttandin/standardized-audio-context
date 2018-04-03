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

        private _nativeNode: TNativeMediaStreamAudioSourceNode;

        constructor (context: IMinimalAudioContext, options: IMediaStreamAudioSourceOptions) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IAudioNodeOptions & IMediaStreamAudioSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = nativeContext.createMediaStreamSource(mergedOptions.mediaStream);

            super(context, nativeNode, null);

            // Bug #63: Edge & Firefox do not expose the mediaStream yet.
            this._mediaStream = mergedOptions.mediaStream;
            this._nativeNode = nativeNode;
        }

        public get mediaStream () {
            // @todo TypeScript is not yet aware of the mediaStream property.
            return ((<any> this._nativeNode).mediaStream === undefined) ? this._mediaStream : (<any> this._nativeNode).mediaStream;
        }

    };

};
