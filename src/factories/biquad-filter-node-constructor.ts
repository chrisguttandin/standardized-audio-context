import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { IAudioParam, IBiquadFilterNode, IBiquadFilterOptions, IMinimalBaseAudioContext } from '../interfaces';
import { BiquadFilterNodeRenderer } from '../renderers/biquad-filter-node';
import {
    TBiquadFilterNodeConstructorFactory,
    TBiquadFilterType,
    TChannelCountMode,
    TChannelInterpretation,
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

        private _nativeNode: TNativeBiquadFilterNode;

        constructor (context: IMinimalBaseAudioContext, options: Partial<IBiquadFilterOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IBiquadFilterOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = createNativeBiquadFilterNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);

            super(context, nativeNode);

            // Bug #80: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._Q = createAudioParam(context, isOffline, nativeNode.Q, 3.4028234663852886e38, -3.4028234663852886e38);
            // Bug #78: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._detune = createAudioParam(context, isOffline, nativeNode.detune, 3.4028234663852886e38, -3.4028234663852886e38);
            // Bug #77: Chrome, Edge, Firefox, Opera & Safari do not export the correct values for maxValue and minValue.
            this._frequency = createAudioParam(context, isOffline, nativeNode.frequency, 3.4028234663852886e38, -3.4028234663852886e38);
            // Bug #79: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._gain = createAudioParam(context, isOffline, nativeNode.gain, 3.4028234663852886e38, -3.4028234663852886e38);
            this._nativeNode = nativeNode;

            if (isOffline) {
                const biquadFilterNodeRenderer = new BiquadFilterNodeRenderer(this);

                AUDIO_NODE_RENDERER_STORE.set(this, biquadFilterNodeRenderer);
            }
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
            return this._nativeNode.type;
        }

        public set type (value) {
            this._nativeNode.type = value;
        }

        public getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) {
            this._nativeNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);

            // Bug #68: Chrome does not throw an error if the parameters differ in their length.
            if ((frequencyHz.length !== magResponse.length) || (magResponse.length !== phaseResponse.length)) {
                throw createInvalidAccessError();
            }
        }

    };

};
