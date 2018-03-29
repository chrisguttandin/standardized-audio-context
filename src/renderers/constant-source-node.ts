import { AUDIO_PARAM_STORE } from '../globals';
import { connectAudioParam } from '../helpers/connect-audio-param';
import { createNativeConstantSourceNode } from '../helpers/create-native-constant-source-node';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { renderAutomation } from '../helpers/render-automation';
import { IAudioParam, IConstantSourceNode, IConstantSourceOptions, INativeConstantSourceNode } from '../interfaces';
import { TNativeAudioParam, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class ConstantSourceNodeRenderer extends AudioNodeRenderer {

    private _nativeNode: null | INativeConstantSourceNode;

    private _proxy: IConstantSourceNode;

    private _start: null | number;

    private _stop: null | number;

    constructor (proxy: IConstantSourceNode) {
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

    public async render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<INativeConstantSourceNode> {
        if (this._nativeNode !== null) {
            return this._nativeNode;
        }

        this._nativeNode = <INativeConstantSourceNode> getNativeNode(this._proxy);

        // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
        if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
            const offsetAudioParam = <IAudioParam> (<any> this._nativeNode.offset);

            const options: IConstantSourceOptions = {
                channelCount: this._nativeNode.channelCount,
                channelCountMode: this._nativeNode.channelCountMode,
                channelInterpretation: this._nativeNode.channelInterpretation,
                offset: this._nativeNode.offset.value
            };

            this._nativeNode = createNativeConstantSourceNode(offlineAudioContext, options);

            await renderAutomation(offlineAudioContext, offsetAudioParam, this._nativeNode.offset);

            if (this._start !== null) {
                this._nativeNode.start(this._start);
            }

            if (this._stop !== null) {
                this._nativeNode.stop(this._stop);
            }
        } else {
            const offsetNativeAudioParam = <TNativeAudioParam> AUDIO_PARAM_STORE.get(this._proxy.offset);

            await connectAudioParam(offlineAudioContext, <IAudioParam> (<any> this._nativeNode.offset), offsetNativeAudioParam);
        }

        await this._connectSources(offlineAudioContext, <INativeConstantSourceNode> this._nativeNode);

        return <INativeConstantSourceNode> this._nativeNode;
    }

}
