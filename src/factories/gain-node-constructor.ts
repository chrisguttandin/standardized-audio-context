import { MOST_NEGATIVE_SINGLE_FLOAT, MOST_POSITIVE_SINGLE_FLOAT } from '../constants';
import { IAudioParam, IGainNode, IGainOptions } from '../interfaces';
import { TAudioNodeRenderer, TContext, TGainNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    gain: 1
} as const;

export const createGainNodeConstructor: TGainNodeConstructorFactory = (
    audioNodeConstructor,
    createAudioParam,
    createGainNodeRenderer,
    createNativeGainNode,
    getNativeContext,
    isNativeOfflineAudioContext
) => {
    return class GainNode<T extends TContext> extends audioNodeConstructor<T> implements IGainNode<T> {
        private _gain: IAudioParam;

        constructor(context: T, options: Partial<IGainOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeGainNode = createNativeGainNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const gainNodeRenderer = <TAudioNodeRenderer<T, this>>(isOffline ? createGainNodeRenderer() : null);

            super(context, false, nativeGainNode, gainNodeRenderer);

            // Bug #74: Edge & Safari do not export the correct values for maxValue and minValue.
            this._gain = createAudioParam(this, isOffline, nativeGainNode.gain, MOST_POSITIVE_SINGLE_FLOAT, MOST_NEGATIVE_SINGLE_FLOAT);
        }

        get gain(): IAudioParam {
            return this._gain;
        }
    };
};
