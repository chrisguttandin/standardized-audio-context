import { AUDIO_PARAM_STORE } from '../globals';
import { connectAudioParam } from '../helpers/connect-audio-param';
import { createNativeOscillatorNode } from '../helpers/create-native-oscillator-node';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { IAudioParam, IOscillatorNode, IOscillatorOptions } from '../interfaces';
import { TNativeAudioNode, TNativeAudioParam, TNativeOscillatorNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class OscillatorNodeRenderer extends AudioNodeRenderer {

    private _nativeNode: null | TNativeOscillatorNode;

    private _proxy: IOscillatorNode;

    private _start: null | number;

    private _stop: null | number;

    constructor (proxy: IOscillatorNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
        this._start = null;
        this._stop = null;
    }

    public set start (value: number) {
        this._start = value;
    }

    public set stop (value: number) {
        this._stop = value;
    }

    public async render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return this._nativeNode;
        }

        this._nativeNode = <TNativeOscillatorNode> getNativeNode(this._proxy);

        // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
        if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
            const detuneAudioParam = <IAudioParam> (<any> this._nativeNode.detune);
            const frequencyAudioParam = <IAudioParam> (<any> this._nativeNode.frequency);

            const options: IOscillatorOptions = {
                channelCount: this._nativeNode.channelCount,
                channelCountMode: this._nativeNode.channelCountMode,
                channelInterpretation: this._nativeNode.channelInterpretation,
                detune: this._nativeNode.detune.value,
                frequency: this._nativeNode.frequency.value,
                // @todo periodicWave is not exposed by the native node.
                type: this._nativeNode.type
            };

            this._nativeNode = createNativeOscillatorNode(offlineAudioContext, options);

            await renderAutomation(offlineAudioContext, detuneAudioParam, this._nativeNode.detune);
            await renderAutomation(offlineAudioContext, frequencyAudioParam, this._nativeNode.frequency);

            if (this._start !== null) {
                this._nativeNode.start(this._start);
            }

            if (this._stop !== null) {
                this._nativeNode.stop(this._stop);
            }
        } else {
            const detuneNativeAudioParam = <TNativeAudioParam> AUDIO_PARAM_STORE.get(this._proxy.detune);
            const frequencyNativeAudioParam = <TNativeAudioParam> AUDIO_PARAM_STORE.get(this._proxy.frequency);

            await connectAudioParam(offlineAudioContext, <IAudioParam> (<any> this._nativeNode.detune), detuneNativeAudioParam);
            await connectAudioParam(offlineAudioContext, <IAudioParam> (<any> this._nativeNode.frequency), frequencyNativeAudioParam);
        }

        await this._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode);

        return <TNativeAudioNode> this._nativeNode;
    }

}
