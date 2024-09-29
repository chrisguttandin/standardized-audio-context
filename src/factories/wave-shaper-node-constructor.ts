import { IWaveShaperNode, IWaveShaperOptions } from '../interfaces';
import { TAudioNodeRenderer, TContext, TNativeWaveShaperNode, TOverSampleType, TWaveShaperNodeConstructorFactory } from '../types';

const DEFAULT_OPTIONS = {
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    curve: null,
    oversample: 'none'
} as const;

export const createWaveShaperNodeConstructor: TWaveShaperNodeConstructorFactory = (
    audioNodeConstructor,
    createInvalidStateError,
    createNativeWaveShaperNode,
    createWaveShaperNodeRenderer,
    getNativeContext,
    isNativeOfflineAudioContext,
    setAudioNodeTailTime
) => {
    return class WaveShaperNode<T extends TContext> extends audioNodeConstructor<T> implements IWaveShaperNode<T> {
        private _nativeWaveShaperNode: TNativeWaveShaperNode;

        constructor(context: T, options?: Partial<IWaveShaperOptions>) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeWaveShaperNode = createNativeWaveShaperNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const waveShaperNodeRenderer = <TAudioNodeRenderer<T, this>>(isOffline ? createWaveShaperNodeRenderer() : null);

            // @todo Add a mechanism to only switch a WaveShaperNode to active while it is connected.
            super(context, true, nativeWaveShaperNode, waveShaperNodeRenderer);

            this._nativeWaveShaperNode = nativeWaveShaperNode;

            // @todo Determine a meaningful tail-time instead of just using one second.
            setAudioNodeTailTime(this, 1);
        }

        get curve(): null | Float32Array {
            return this._nativeWaveShaperNode.curve;
        }

        set curve(value) {
            // Bug #104: Chrome throws an InvalidAccessError when the curve has less than two samples.
            if (value !== null && value.length < 2) {
                throw createInvalidStateError();
            }

            this._nativeWaveShaperNode.curve = value;
        }

        get oversample(): TOverSampleType {
            return this._nativeWaveShaperNode.oversample;
        }

        set oversample(value) {
            this._nativeWaveShaperNode.oversample = value;
        }
    };
};
