import { AudioParam } from '../audio-param';
import { createInvalidAccessError } from '../factories/invalid-access-error';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeBiquadFilterNode } from '../helpers/create-native-biquad-filter-node';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioParam, IBiquadFilterNode, IBiquadFilterOptions, IMinimalBaseAudioContext } from '../interfaces';
import { BiquadFilterNodeRenderer } from '../renderers/biquad-filter-node';
import { TBiquadFilterType, TChannelCountMode, TChannelInterpretation, TNativeBiquadFilterNode } from '../types';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

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

export class BiquadFilterNode extends NoneAudioDestinationNode<TNativeBiquadFilterNode> implements IBiquadFilterNode {

    private _Q: IAudioParam;

    private _detune: IAudioParam;

    private _frequency: IAudioParam;

    private _gain: IAudioParam;

    constructor (context: IMinimalBaseAudioContext, options: Partial<IBiquadFilterOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IBiquadFilterOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeBiquadFilterNode(nativeContext, mergedOptions);

        super(context, nativeNode, mergedOptions.channelCount);

        // Bug #80: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
        this._Q = new AudioParam({
            context,
            maxValue: 3.4028234663852886e38,
            minValue: -3.4028234663852886e38,
            nativeAudioParam: nativeNode.Q
        });
        // Bug #78: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
        this._detune = new AudioParam({
            context,
            maxValue: 3.4028234663852886e38,
            minValue: -3.4028234663852886e38,
            nativeAudioParam: nativeNode.detune
        });
        // Bug #77: Chrome, Edge, Firefox, Opera & Safari do not export the correct values for maxValue and minValue.
        this._frequency = new AudioParam({
            context,
            maxValue: 3.4028234663852886e38,
            minValue: -3.4028234663852886e38,
            nativeAudioParam: nativeNode.frequency
        });
        // Bug #79: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
        this._gain = new AudioParam({
            context,
            maxValue: 3.4028234663852886e38,
            minValue: -3.4028234663852886e38,
            nativeAudioParam: nativeNode.gain
        });

        if (isOfflineAudioContext(nativeContext)) {
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

}
