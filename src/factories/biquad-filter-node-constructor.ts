import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IBiquadFilterNode, IBiquadFilterOptions } from '../interfaces';
import { TBiquadFilterNodeConstructorFactory, TBiquadFilterType, TContext, TNativeBiquadFilterNode } from '../types';

const DEFAULT_OPTIONS: IBiquadFilterOptions = {
    Q: 1,
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    detune: 0,
    frequency: 350,
    gain: 0,
    type: 'lowpass'
};

export const createBiquadFilterNodeConstructor: TBiquadFilterNodeConstructorFactory = (
    createAudioParam,
    createBiquadFilterNodeRenderer,
    createInvalidAccessError,
    createNativeBiquadFilterNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class BiquadFilterNode extends noneAudioDestinationNodeConstructor implements IBiquadFilterNode {

        private _detune: IAudioParam;

        private _frequency: IAudioParam;

        private _gain: IAudioParam;

        private _nativeBiquadFilterNode: TNativeBiquadFilterNode;

        private _Q: IAudioParam;

        constructor (context: TContext, options: Partial<IBiquadFilterOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeBiquadFilterNode = createNativeBiquadFilterNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const biquadFilterNodeRenderer = (isOffline) ? createBiquadFilterNodeRenderer() : null;

            super(context, nativeBiquadFilterNode, biquadFilterNodeRenderer);

            // Bug #80: Edge & Safari do not export the correct values for maxValue and minValue.
            this._Q = createAudioParam(context, isOffline, nativeBiquadFilterNode.Q, 3.4028234663852886e38, -3.4028234663852886e38);
            // Bug #78: Edge & Safari do not export the correct values for maxValue and minValue.
            this._detune = createAudioParam(
                context,
                isOffline,
                nativeBiquadFilterNode.detune,
                3.4028234663852886e38,
                -3.4028234663852886e38
            );
            // Bug #77: Chrome, Edge, Firefox, Opera & Safari do not export the correct values for maxValue and minValue.
            this._frequency = createAudioParam(
                context,
                isOffline,
                nativeBiquadFilterNode.frequency,
                3.4028234663852886e38,
                -3.4028234663852886e38
            );
            // Bug #79: Edge & Safari do not export the correct values for maxValue and minValue.
            this._gain = createAudioParam(context, isOffline, nativeBiquadFilterNode.gain, 3.4028234663852886e38, -3.4028234663852886e38);
            this._nativeBiquadFilterNode = nativeBiquadFilterNode;
        }

        public get Q (): IAudioParam {
            return this._Q;
        }

        public get detune (): IAudioParam {
            return this._detune;
        }

        public get frequency (): IAudioParam {
            return this._frequency;
        }

        public get gain (): IAudioParam {
            return this._gain;
        }

        public get type (): TBiquadFilterType {
            return this._nativeBiquadFilterNode.type;
        }

        public set type (value) {
            this._nativeBiquadFilterNode.type = value;
        }

        public getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void {
            this._nativeBiquadFilterNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);

            // Bug #68: Only Chrome & Opera do throw an error if the parameters differ in their length.
            if ((frequencyHz.length !== magResponse.length) || (magResponse.length !== phaseResponse.length)) {
                throw createInvalidAccessError();
            }
        }

    };

};
