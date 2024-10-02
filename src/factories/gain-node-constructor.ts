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

        constructor(context: T, options?: Partial<IGainOptions>) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeGainNode = createNativeGainNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const gainNodeRenderer = <TAudioNodeRenderer<T, this>>(isOffline ? createGainNodeRenderer() : null);

            super(context, false, nativeGainNode, gainNodeRenderer);

            this._gain = createAudioParam(this, isOffline, nativeGainNode.gain);
        }

        get gain(): IAudioParam {
            return this._gain;
        }
    };
};
