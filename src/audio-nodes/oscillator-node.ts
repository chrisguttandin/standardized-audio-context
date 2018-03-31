import { Injector } from '@angular/core';
import { createInvalidStateError } from '../factories/invalid-state-error';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeOscillatorNode } from '../helpers/create-native-oscillator-node';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioParam, IMinimalBaseAudioContext, IOscillatorNode, IOscillatorOptions } from '../interfaces';
import { OscillatorNodeRenderer } from '../renderers/oscillator-node';
import { TChannelCountMode, TChannelInterpretation, TEndedEventHandler, TNativeOscillatorNode, TOscillatorType } from '../types';
import { AUDIO_PARAM_WRAPPER_PROVIDER, AudioParamWrapper } from '../wrappers/audio-param';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const injector = Injector.create({
    providers: [
        AUDIO_PARAM_WRAPPER_PROVIDER
    ]
});

const audioParamWrapper = injector.get(AudioParamWrapper);

// The DEFAULT_OPTIONS are only of type Partial<IOscillatorOptions> because there is no default value for periodicWave.
const DEFAULT_OPTIONS: Partial<IOscillatorOptions> = {
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max', // This attribute has no effect for nodes with no inputs.
    channelInterpretation: <TChannelInterpretation> 'speakers', // This attribute has no effect for nodes with no inputs.
    detune: 0,
    frequency: 440,
    type: <TOscillatorType> 'sine'
};

export class OscillatorNode extends NoneAudioDestinationNode<TNativeOscillatorNode> implements IOscillatorNode {

    private _oscillatorNodeRenderer: null | OscillatorNodeRenderer;

    constructor (context: IMinimalBaseAudioContext, options: Partial<IOscillatorOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IOscillatorOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeOscillatorNode(nativeContext, mergedOptions);

        super(context, nativeNode, mergedOptions.channelCount);

        // Bug #81: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
        audioParamWrapper.wrap(nativeNode, context, nativeNode.detune, 'detune', 3.4028234663852886e38, -3.4028234663852886e38);
        // Bug #76: Edge & Safari do not export the correct values for maxValue and minValue.
        audioParamWrapper.wrap(nativeNode, context, nativeNode.frequency, 'frequency', context.sampleRate / 2, -(context.sampleRate / 2));

        if (isOfflineAudioContext(nativeContext)) {
            const oscillatorNodeRenderer = new OscillatorNodeRenderer(this);

            AUDIO_NODE_RENDERER_STORE.set(this, oscillatorNodeRenderer);

            this._oscillatorNodeRenderer = oscillatorNodeRenderer;
        } else {
            this._oscillatorNodeRenderer = null;
        }
    }

    public get detune () {
        return <IAudioParam> (<any> this._nativeNode.detune);
    }

    public get frequency () {
        return <IAudioParam> (<any> this._nativeNode.frequency);
    }

    public get onended () {
        return <TEndedEventHandler> (<any> this._nativeNode.onended);
    }

    public set onended (value) {
        this._nativeNode.onended = <any> value;
    }

    public get type () {
        return this._nativeNode.type;
    }

    public set type (value) {
        this._nativeNode.type = value;

        // Bug #57: Edge will not throw an error when assigning the type to 'custom'. But it still will change the value.
        if (value === 'custom') {
            throw createInvalidStateError();
        }
    }

    public setPeriodicWave (periodicWave: PeriodicWave) {
        this._nativeNode.setPeriodicWave(periodicWave);
    }

    public start (when = 0) {
        this._nativeNode.start(when);

        if (this._oscillatorNodeRenderer !== null) {
            this._oscillatorNodeRenderer.start = when;
        }
    }

    public stop (when = 0) {
        this._nativeNode.stop(when);

        if (this._oscillatorNodeRenderer !== null) {
            this._oscillatorNodeRenderer.stop = when;
        }
    }

}
