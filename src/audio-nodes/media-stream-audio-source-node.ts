import { getNativeContext } from '../helpers/get-native-context';
import { IMediaStreamAudioSourceNode, IMediaStreamAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TChannelCountMode, TChannelInterpretation, TNativeMediaStreamAudioSourceNode } from '../types';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

// The DEFAULT_OPTIONS are only of type Partial<IMediaStreamAudioSourceOptions> because there is no default value for mediaStream.
const DEFAULT_OPTIONS: Partial<IMediaStreamAudioSourceOptions> = {
    channelCount: 2, // @todo channelCount is not specified because it is ignored when the channelCountMode equals 'max'.
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    numberOfInputs: 0,
    numberOfOutputs: 1
};

export class MediaStreamAudioSourceNode
    extends NoneAudioDestinationNode<TNativeMediaStreamAudioSourceNode>
    implements IMediaStreamAudioSourceNode {

    private _mediaStream: MediaStream;

    constructor (
        context: IMinimalAudioContext,
        options: { mediaStream: IMediaStreamAudioSourceOptions['mediaStream'] } & Partial<IMediaStreamAudioSourceOptions>
    ) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IMediaStreamAudioSourceOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = nativeContext.createMediaStreamSource(mergedOptions.mediaStream);

        super(context, nativeNode, mergedOptions);

        // Bug #63: Edge & Firefox do not expose the mediaStream yet.
        this._mediaStream = mergedOptions.mediaStream;
    }

    public get mediaStream () {
        // @todo TypeScript is not yet aware of the mediaStream property.
        return ((<any> this._nativeNode).mediaStream === undefined) ? this._mediaStream : (<any> this._nativeNode).mediaStream;
    }

}
