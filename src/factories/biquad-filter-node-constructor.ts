import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IBiquadFilterNode, IBiquadFilterOptions } from '../interfaces';
import {
    TBiquadFilterNodeConstructorFactory,
    TBiquadFilterType,
    TChannelCountMode,
    TChannelInterpretation,
    TContext,
    TNativeBiquadFilterNode
} from '../types';

const DEFAULT_OPTIONS: IBiquadFilterOptions = {
    Q: 1,
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    detune: 0,
    frequency: 350,
    gain: 0,
    type: <TBiquadFilterType> 'lowpass'
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

        private _Q: IAudioParam;

        private _detune: IAudioParam;

        private _frequency: IAudioParam;

        private _gain: IAudioParam;

        private _nativeBiquadFilterNode: TNativeBiquadFilterNode;

        constructor (context: TContext, options: Partial<IBiquadFilterOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IBiquadFilterOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeBiquadFilterNode = createNativeBiquadFilterNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const biquadFilterNodeRenderer = (isOffline) ? createBiquadFilterNodeRenderer() : null;

            super(context, nativeBiquadFilterNode, biquadFilterNodeRenderer);

            // Bug #80: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._Q = createAudioParam(context, isOffline, nativeBiquadFilterNode.Q, 3.4028234663852886e38, -3.4028234663852886e38);
            // Bug #78: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
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
            // Bug #79: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._gain = createAudioParam(context, isOffline, nativeBiquadFilterNode.gain, 3.4028234663852886e38, -3.4028234663852886e38);
            this._nativeBiquadFilterNode = nativeBiquadFilterNode;
        }

        public get Q () {
            return this._Q;
        }

        public get detune () {
            return this._detune;
        }

        public get frequency () {
            return this._frequency;
        }

        public get gain () {
            return this._gain;
        }

        public get type () {
            return this._nativeBiquadFilterNode.type;
        }

        public set type (value) {
            this._nativeBiquadFilterNode.type = value;
        }

        public getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) {
            this._nativeBiquadFilterNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);

            // Bug #68: Only Chrome does throw an error if the parameters differ in their length.
            if ((frequencyHz.length !== magResponse.length) || (magResponse.length !== phaseResponse.length)) {
                throw createInvalidAccessError();
            }
        }

    };

};
