import { MOST_NEGATIVE_SINGLE_FLOAT, MOST_POSITIVE_SINGLE_FLOAT } from '../constants';
import { IAudioParam, IBiquadFilterNode, IBiquadFilterOptions } from '../interfaces';
import { TAudioNodeRenderer, TBiquadFilterNodeConstructorFactory, TBiquadFilterType, TContext, TNativeBiquadFilterNode } from '../types';

const DEFAULT_OPTIONS = {
    Q: 1,
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    detune: 0,
    frequency: 350,
    gain: 0,
    type: 'lowpass'
} as const;

export const createBiquadFilterNodeConstructor: TBiquadFilterNodeConstructorFactory = (
    audioNodeConstructor,
    createAudioParam,
    createBiquadFilterNodeRenderer,
    createNativeBiquadFilterNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    setAudioNodeTailTime
) => {
    return class BiquadFilterNode<T extends TContext> extends audioNodeConstructor<T> implements IBiquadFilterNode<T> {
        private _detune: IAudioParam;

        private _frequency: IAudioParam;

        private _gain: IAudioParam;

        private _nativeBiquadFilterNode: TNativeBiquadFilterNode;

        private _Q: IAudioParam;

        constructor(context: T, options?: Partial<IBiquadFilterOptions>) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeBiquadFilterNode = createNativeBiquadFilterNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const biquadFilterNodeRenderer = <TAudioNodeRenderer<T, this>>(isOffline ? createBiquadFilterNodeRenderer() : null);

            super(context, false, nativeBiquadFilterNode, biquadFilterNodeRenderer);

            this._Q = createAudioParam(this, isOffline, nativeBiquadFilterNode.Q);
            // Bug #78: Firefox does not export the correct values for maxValue and minValue.
            this._detune = createAudioParam(
                this,
                isOffline,
                nativeBiquadFilterNode.detune,
                1200 * Math.log2(MOST_POSITIVE_SINGLE_FLOAT),
                -1200 * Math.log2(MOST_POSITIVE_SINGLE_FLOAT)
            );
            // Bug #77: Firefox does not export the correct value for minValue.
            this._frequency = createAudioParam(this, isOffline, nativeBiquadFilterNode.frequency, context.sampleRate / 2, 0);
            // Bug #79: Firefox does not export the correct values for maxValue and minValue.
            this._gain = createAudioParam(
                this,
                isOffline,
                nativeBiquadFilterNode.gain,
                40 * Math.log10(MOST_POSITIVE_SINGLE_FLOAT),
                MOST_NEGATIVE_SINGLE_FLOAT
            );
            this._nativeBiquadFilterNode = nativeBiquadFilterNode;

            // @todo Determine a meaningful tail-time instead of just using one second.
            setAudioNodeTailTime(this, 1);
        }

        get detune(): IAudioParam {
            return this._detune;
        }

        get frequency(): IAudioParam {
            return this._frequency;
        }

        get gain(): IAudioParam {
            return this._gain;
        }

        get Q(): IAudioParam {
            return this._Q;
        }

        get type(): TBiquadFilterType {
            return this._nativeBiquadFilterNode.type;
        }

        set type(value) {
            this._nativeBiquadFilterNode.type = value;
        }

        public getFrequencyResponse(
            frequencyHz: Float32Array<ArrayBuffer>,
            magResponse: Float32Array<ArrayBuffer>,
            phaseResponse: Float32Array<ArrayBuffer>
        ): void {
            this._nativeBiquadFilterNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
        }
    };
};
