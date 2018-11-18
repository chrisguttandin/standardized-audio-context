import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IStereoPannerNode, IStereoPannerOptions } from '../interfaces';
import { TChannelCountMode, TChannelInterpretation, TContext, TStereoPannerNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS: IStereoPannerOptions = {
    channelCount: 2,
    /*
     * Bug #105: The channelCountMode should be 'clamped-max' according to the spec but is set to 'explicit' to achieve consistent
     * behavior.
     */
    channelCountMode: <TChannelCountMode> 'explicit',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    pan: 0
};

export const createStereoPannerNodeConstructor: TStereoPannerNodeConstructorFactory = (
    createAudioParam,
    createNativeStereoPannerNode,
    createStereoPannerNodeRenderer,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class StereoPannerNode extends noneAudioDestinationNodeConstructor implements IStereoPannerNode {

        private _pan: IAudioParam;

        constructor (context: TContext, options: Partial<IStereoPannerOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IStereoPannerOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeStereoPannerNode = createNativeStereoPannerNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const stereoPannerNodeRenderer = (isOffline) ? createStereoPannerNodeRenderer() : null;

            super(context, nativeStereoPannerNode, stereoPannerNodeRenderer);

            // Bug #106: Edge does not export a maxValue and minValue property.
            this._pan = createAudioParam(context, isOffline, nativeStereoPannerNode.pan, 1, -1);
        }

        public get pan (): IAudioParam {
            return this._pan;
        }

    };

};
