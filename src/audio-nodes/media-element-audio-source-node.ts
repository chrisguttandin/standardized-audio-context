import { getNativeContext } from '../helpers/get-native-context';
import { IMediaElementAudioSourceNode, IMediaElementAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TChannelCountMode, TChannelInterpretation, TNativeMediaElementAudioSourceNode } from '../types';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

// The DEFAULT_OPTIONS are only of type Partial<IMediaElementAudioSourceOptions> because there is no default value for mediaElement.
const DEFAULT_OPTIONS: Partial<IMediaElementAudioSourceOptions> = {
    channelCount: 2, // @todo channelCount is not specified because it is ignored when the channelCountMode equals 'max'.
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    numberOfInputs: 0,
    numberOfOutputs: 1
};

export class MediaElementAudioSourceNode
    extends NoneAudioDestinationNode<TNativeMediaElementAudioSourceNode>
    implements IMediaElementAudioSourceNode {

    private _mediaElement: HTMLMediaElement;

    constructor (
        context: IMinimalAudioContext,
        options: { mediaElement: IMediaElementAudioSourceOptions['mediaElement'] } & Partial<IMediaElementAudioSourceOptions>
    ) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IMediaElementAudioSourceOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = nativeContext.createMediaElementSource(mergedOptions.mediaElement);

        super(context, nativeNode, mergedOptions);

        // Bug #63: Edge & Firefox do not expose the mediaElement yet.
        this._mediaElement = mergedOptions.mediaElement;
    }

    public get mediaElement () {
        // @todo TypeScript is not yet aware of the mediaElement property.
        return ((<any> this._nativeNode).mediaElement === undefined) ? this._mediaElement : (<any> this._nativeNode).mediaElement;
    }

}
