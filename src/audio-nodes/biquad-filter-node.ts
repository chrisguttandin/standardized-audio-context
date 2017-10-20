import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core'; // tslint:disable-line:ordered-imports
import { RENDERER_STORE } from '../globals';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioParam, IBiquadFilterNode, IBiquadFilterOptions, IMinimalBaseAudioContext } from '../interfaces';
import { BiquadFilterNodeRenderer } from '../renderers/biquad-filter-node';
import { TBiquadFilterType, TChannelCountMode, TChannelInterpretation, TNativeBiquadFilterNode } from '../types';
import { AudioParamWrapper } from '../wrappers/audio-param';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const injector = ReflectiveInjector.resolveAndCreate([
    AudioParamWrapper
]);

const audioParamWrapper = injector.get(AudioParamWrapper);

const DEFAULT_OPTIONS: IBiquadFilterOptions = {
    Q: 1,
    channelCount: 2, // @todo channelCount is not specified because it is ignored when the channelCountMode equals 'max'.
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    detune: 0,
    frequency: 350,
    gain: 0,
    numberOfInputs: 1,
    numberOfOutputs: 1,
    type: <TBiquadFilterType> 'lowpass'
};

export class BiquadFilterNode extends NoneAudioDestinationNode implements IBiquadFilterNode {

    constructor (context: IMinimalBaseAudioContext, options: Partial<IBiquadFilterOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IBiquadFilterOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = nativeContext.createBiquadFilter();

        super(context, nativeNode, mergedOptions);

        // @todo Set values for Q, detune, frequency and gain.

        if (isOfflineAudioContext(nativeContext)) {
            const biquadFilterNodeRenderer = new BiquadFilterNodeRenderer(this);

            RENDERER_STORE.set(this, biquadFilterNodeRenderer);

            audioParamWrapper.wrap(nativeNode, 'Q');
            audioParamWrapper.wrap(nativeNode, 'detune');
            audioParamWrapper.wrap(nativeNode, 'frequency');
            audioParamWrapper.wrap(nativeNode, 'gain');
        }
    }

    public get Q (): IAudioParam {
        if (this._nativeNode === null) {
            throw new Error('The associated nativeNode is missing.');
        }

        return <IAudioParam> (<any> this._nativeNode).Q;
    }

    public get detune (): IAudioParam {
        if (this._nativeNode === null) {
            throw new Error('The associated nativeNode is missing.');
        }

        return <IAudioParam> (<any> this._nativeNode).detune;
    }

    public get frequency (): IAudioParam {
        if (this._nativeNode === null) {
            throw new Error('The associated nativeNode is missing.');
        }

        return <IAudioParam> (<any> this._nativeNode).frequency;
    }

    public get gain (): IAudioParam {
        if (this._nativeNode === null) {
            throw new Error('The associated nativeNode is missing.');
        }

        return <IAudioParam> (<any> this._nativeNode).gain;
    }

    public get type () {
        return (<TNativeBiquadFilterNode> this._nativeNode).type;
    }

    public set type (value) {
        (<TNativeBiquadFilterNode> this._nativeNode).type = value;
    }

    public getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) {
        return (<TNativeBiquadFilterNode> this._nativeNode).getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
    }

}
