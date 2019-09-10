import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IMinimalBaseAudioContext, IStereoPannerNode, IStereoPannerOptions } from '../interfaces';
import { TAudioNodeRenderer, TStereoPannerNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS = {
    channelCount: 2,
    /*
     * Bug #105: The channelCountMode should be 'clamped-max' according to the spec but is set to 'explicit' to achieve consistent
     * behavior.
     */
    channelCountMode: 'explicit',
    channelInterpretation: 'speakers',
    pan: 0
} as const;

export const createStereoPannerNodeConstructor: TStereoPannerNodeConstructorFactory = (
    createAudioParam,
    createNativeStereoPannerNode,
    createStereoPannerNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class StereoPannerNode<T extends IMinimalBaseAudioContext>
            extends noneAudioDestinationNodeConstructor<T>
            implements IStereoPannerNode<T> {

        private _pan: IAudioParam;

        constructor (context: T, options: Partial<IStereoPannerOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeStereoPannerNode = createNativeStereoPannerNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const stereoPannerNodeRenderer = <TAudioNodeRenderer<T, this>> ((isOffline) ? createStereoPannerNodeRenderer() : null);

            super(context, false, nativeStereoPannerNode, stereoPannerNodeRenderer);

            // Bug #106: Edge does not export a maxValue and minValue property.
            this._pan = createAudioParam(this, isOffline, nativeStereoPannerNode.pan, 1, -1);
        }

        get pan (): IAudioParam {
            return this._pan;
        }

    };

};
