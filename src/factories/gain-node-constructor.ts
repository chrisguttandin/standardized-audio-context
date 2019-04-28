import { MOST_NEGATIVE_SINGLE_FLOAT, MOST_POSITIVE_SINGLE_FLOAT } from '../constants';
import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IGainNode, IGainOptions, IMinimalBaseAudioContext } from '../interfaces';
import { TAudioNodeRenderer, TGainNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS: IGainOptions = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    gain: 1
};

export const createGainNodeConstructor: TGainNodeConstructorFactory = (
    createAudioParam,
    createGainNodeRenderer,
    createNativeGainNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class GainNode<T extends IMinimalBaseAudioContext> extends noneAudioDestinationNodeConstructor<T> implements IGainNode<T> {

        private _gain: IAudioParam;

        constructor (context: T, options: Partial<IGainOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeGainNode = createNativeGainNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const gainNodeRenderer = <TAudioNodeRenderer<T, this>> ((isOffline) ? createGainNodeRenderer() : null);

            super(context, 'passive', nativeGainNode, gainNodeRenderer);

            // Bug #74: Edge & Safari do not export the correct values for maxValue and minValue.
            this._gain = createAudioParam(context, isOffline, nativeGainNode.gain, MOST_POSITIVE_SINGLE_FLOAT, MOST_NEGATIVE_SINGLE_FLOAT);
        }

        get gain (): IAudioParam {
            return this._gain;
        }

    };

};
