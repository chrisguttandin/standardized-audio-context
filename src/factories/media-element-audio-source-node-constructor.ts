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

        private _nativeMediaElementAudioSourceNode: TNativeMediaElementAudioSourceNode;

        constructor (context: IMinimalAudioContext, options: IMediaElementAudioSourceOptions) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IAudioNodeOptions & IMediaElementAudioSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeMediaElementAudioSourceNode = nativeContext.createMediaElementSource(mergedOptions.mediaElement);

            super(context, nativeMediaElementAudioSourceNode, null);

            // Bug #63: Edge & Firefox do not expose the mediaElement yet.
            this._mediaElement = mergedOptions.mediaElement;
            this._nativeMediaElementAudioSourceNode = nativeMediaElementAudioSourceNode;
        }

        public get mediaElement () {
            return (this._nativeMediaElementAudioSourceNode.mediaElement === undefined) ?
                this._mediaElement :
                this._nativeMediaElementAudioSourceNode.mediaElement;
        }

    };

};
