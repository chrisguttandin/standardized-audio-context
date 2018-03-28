import { AUDIO_PARAM_STORE } from '../globals';
import { connectAudioParam } from '../helpers/connect-audio-param';
import { createNativeOscillatorNode } from '../helpers/create-native-oscillator-node';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { IAudioParam, IOscillatorNode } from '../interfaces';
import { TNativeAudioNode, TNativeAudioParam, TNativeOscillatorNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class OscillatorNodeRenderer extends AudioNodeRenderer {

    private _nativeNode: null | TNativeOscillatorNode;

    private _proxy: IOscillatorNode;

    constructor (proxy: IOscillatorNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
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

            this._nativeNode = createNativeOscillatorNode(offlineAudioContext);

            await renderAutomation(offlineAudioContext, detuneAudioParam, this._nativeNode.detune);
            await renderAutomation(offlineAudioContext, frequencyAudioParam, this._nativeNode.frequency);
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
