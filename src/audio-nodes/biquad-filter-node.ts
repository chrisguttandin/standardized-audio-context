import { Injector } from '@angular/core';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioParam, IBiquadFilterNode, IBiquadFilterOptions, IMinimalBaseAudioContext } from '../interfaces';
import { BiquadFilterNodeRenderer } from '../renderers/biquad-filter-node';
import { TBiquadFilterType, TChannelCountMode, TChannelInterpretation, TNativeBiquadFilterNode } from '../types';
import { AUDIO_PARAM_WRAPPER_PROVIDER, AudioParamWrapper } from '../wrappers/audio-param';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const injector = Injector.create({
    providers: [
        AUDIO_PARAM_WRAPPER_PROVIDER
    ]
});

const audioParamWrapper = injector.get(AudioParamWrapper);

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

    constructor (context: IMinimalBaseAudioContext, options: Partial<IBiquadFilterOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const { channelCount } = <IBiquadFilterOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = nativeContext.createBiquadFilter();

        super(context, nativeNode, channelCount);

        // @todo Set values for Q, detune, frequency and gain.

        if (isOfflineAudioContext(nativeContext)) {
            const biquadFilterNodeRenderer = new BiquadFilterNodeRenderer(this);

            AUDIO_NODE_RENDERER_STORE.set(this, biquadFilterNodeRenderer);

            audioParamWrapper.wrap(nativeNode, context, 'Q');
            audioParamWrapper.wrap(nativeNode, context, 'detune');
            audioParamWrapper.wrap(nativeNode, context, 'frequency');
            audioParamWrapper.wrap(nativeNode, context, 'gain');
        }
    }

    public get Q () {
        return <IAudioParam> (<any> this._nativeNode.Q);
    }

    public get detune () {
        return <IAudioParam> (<any> this._nativeNode.detune);
    }

    public get frequency () {
        return <IAudioParam> (<any> this._nativeNode.frequency);
    }

    public get gain () {
        return <IAudioParam> (<any> this._nativeNode.gain);
    }

    public get type () {
        return this._nativeNode.type;
    }

    public set type (value) {
        this._nativeNode.type = value;
    }

    public getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) {
        return this._nativeNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
    }

}
