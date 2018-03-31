import { connectAudioParam } from '../helpers/connect-audio-param';
import { createNativeBiquadFilterNode } from '../helpers/create-native-biquad-filter-node';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { IBiquadFilterNode, IBiquadFilterOptions } from '../interfaces';
import { TNativeAudioNode, TNativeBiquadFilterNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class BiquadFilterNodeRenderer extends AudioNodeRenderer {

    private _nativeNode: null | TNativeBiquadFilterNode;

    private _proxy: IBiquadFilterNode;

    constructor (proxy: IBiquadFilterNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
    }

    public async render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return Promise.resolve(this._nativeNode);
        }

        this._nativeNode = <TNativeBiquadFilterNode> getNativeNode(this._proxy);

        // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
        if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
            const options: IBiquadFilterOptions = {
                Q: this._nativeNode.Q.value,
                channelCount: this._nativeNode.channelCount,
                channelCountMode: this._nativeNode.channelCountMode,
                channelInterpretation: this._nativeNode.channelInterpretation,
                detune: this._nativeNode.detune.value,
                frequency: this._nativeNode.frequency.value,
                gain: this._nativeNode.gain.value,
                type: this._nativeNode.type
            };

            this._nativeNode = createNativeBiquadFilterNode(offlineAudioContext, options);

            await renderAutomation(offlineAudioContext, this._proxy.Q, this._nativeNode.Q);
            await renderAutomation(offlineAudioContext, this._proxy.detune, this._nativeNode.detune);
            await renderAutomation(offlineAudioContext, this._proxy.frequency, this._nativeNode.frequency);
            await renderAutomation(offlineAudioContext, this._proxy.gain, this._nativeNode.gain);
        } else {
            await connectAudioParam(offlineAudioContext, this._proxy.Q);
            await connectAudioParam(offlineAudioContext, this._proxy.detune);
            await connectAudioParam(offlineAudioContext, this._proxy.frequency);
            await connectAudioParam(offlineAudioContext, this._proxy.gain);
        }

        await this._connectSources(offlineAudioContext, this._nativeNode);

        return this._nativeNode;
    }

}
