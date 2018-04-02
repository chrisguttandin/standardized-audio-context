import { getNativeContext } from '../helpers/get-native-context';
import { IAudioNodeOptions, IMediaElementAudioSourceNode, IMediaElementAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TMediaElementAudioSourceNodeConstructorFactory,
    TNativeMediaElementAudioSourceNode
} from '../types';

const DEFAULT_OPTIONS: IAudioNodeOptions = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers'
};

export const createMediaElementAudioSourceNodeConstructor: TMediaElementAudioSourceNodeConstructorFactory = (
    noneAudioDestinationNodeConstructor
) => {

    return class MediaElementAudioSourceNode extends noneAudioDestinationNodeConstructor implements IMediaElementAudioSourceNode {

        private _mediaElement: HTMLMediaElement;

        private _nativeNode: TNativeMediaElementAudioSourceNode;

        constructor (context: IMinimalAudioContext, options: IMediaElementAudioSourceOptions) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IAudioNodeOptions & IMediaElementAudioSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = nativeContext.createMediaElementSource(mergedOptions.mediaElement);

            super(context, nativeNode);

            // Bug #63: Edge & Firefox do not expose the mediaElement yet.
            this._mediaElement = mergedOptions.mediaElement;
            this._nativeNode = nativeNode;
        }

        public get mediaElement () {
            // @todo TypeScript is not yet aware of the mediaElement property.
            return ((<any> this._nativeNode).mediaElement === undefined) ? this._mediaElement : (<any> this._nativeNode).mediaElement;
        }

    };

};
