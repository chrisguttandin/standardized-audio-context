import { getNativeAudioContext } from '../helpers/get-native-audio-context';
import { IAudioNodeOptions, IMediaElementAudioSourceNode, IMediaElementAudioSourceOptions, IMinimalAudioContext } from '../interfaces';
import { TMediaElementAudioSourceNodeConstructorFactory, TNativeMediaElementAudioSourceNode } from '../types';

const DEFAULT_OPTIONS: IAudioNodeOptions = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers'
};

export const createMediaElementAudioSourceNodeConstructor: TMediaElementAudioSourceNodeConstructorFactory = (
    createNativeMediaElementAudioSourceNode,
    createNotSupportedError,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class MediaElementAudioSourceNode extends noneAudioDestinationNodeConstructor implements IMediaElementAudioSourceNode {

        private _mediaElement: HTMLMediaElement;

        private _nativeMediaElementAudioSourceNode: TNativeMediaElementAudioSourceNode;

        constructor (context: IMinimalAudioContext, options: IMediaElementAudioSourceOptions) {
            const nativeContext = getNativeAudioContext(context);

            if (isNativeOfflineAudioContext(nativeContext)) {
                throw createNotSupportedError();
            }

            const mergedOptions = <IAudioNodeOptions & IMediaElementAudioSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeMediaElementAudioSourceNode = createNativeMediaElementAudioSourceNode(nativeContext, mergedOptions);

            super(context, nativeMediaElementAudioSourceNode, null);

            // Bug #63: Edge & Firefox do not expose the mediaElement yet.
            this._mediaElement = mergedOptions.mediaElement;
            this._nativeMediaElementAudioSourceNode = nativeMediaElementAudioSourceNode;
        }

        get mediaElement (): HTMLMediaElement {
            return (this._nativeMediaElementAudioSourceNode.mediaElement === undefined) ?
                this._mediaElement :
                this._nativeMediaElementAudioSourceNode.mediaElement;
        }

    };

};
