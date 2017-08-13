import { IAudioBufferSourceNode, IAudioNodeRenderer } from '../interfaces';
import { TNativeAudioBufferSourceNode, TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class AudioBufferSourceNodeRenderer extends AudioNodeRenderer implements IAudioNodeRenderer {

    private _node: null | TNativeAudioBufferSourceNode;

    private _proxy: IAudioBufferSourceNode;

    private _start: null | { duration?: number, offset: number, when: number };

    constructor (proxy: IAudioBufferSourceNode) {
        super();

        this._node = null;
        this._proxy = proxy;
        this._start = null;
    }

    public set start (value: { duration?: number, offset: number, when: number }) {
        this._start = value;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        this._node = offlineAudioContext.createBufferSource();
        this._node.buffer = (this._proxy.buffer === null) ? null : this._proxy.buffer;

        if (this._start !== null) {
            const { duration, offset, when } = this._start;

            if (duration === undefined) {
                this._node.start(when, offset);
            } else {
                this._node.start(when, offset, duration);
            }
        }

        return this
            ._connectSources(offlineAudioContext, <TNativeAudioNode> this._node)
            .then(() => <TNativeAudioNode> this._node);
    }

}
