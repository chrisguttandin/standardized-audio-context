import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IGainNode, IGainOptions } from '../interfaces';
import { TChannelCountMode, TChannelInterpretation, TContext, TGainNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS: IGainOptions = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    gain: 1
};

export const createGainNodeConstructor: TGainNodeConstructorFactory = (
    createAudioParam,
    createGainNodeRenderer,
    createNativeGainNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class GainNode extends noneAudioDestinationNodeConstructor implements IGainNode {

        private _gain: IAudioParam;

        constructor (context: TContext, options: Partial<IGainOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IGainOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeGainNode = createNativeGainNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const gainNodeRenderer = (isOffline) ? createGainNodeRenderer() : null;

            super(context, nativeGainNode, gainNodeRenderer);

            // Bug #74: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._gain = createAudioParam(context, isOffline, nativeGainNode.gain, 3.4028234663852886e38, -3.4028234663852886e38);
        }

        public get gain () {
            return this._gain;
        }

    };

};
