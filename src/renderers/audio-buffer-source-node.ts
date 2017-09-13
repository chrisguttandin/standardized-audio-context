import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioBufferSourceNode, IAudioNodeRenderer } from '../interfaces';
import { TNativeAudioBufferSourceNode, TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class AudioBufferSourceNodeRenderer extends AudioNodeRenderer implements IAudioNodeRenderer {

    private _nativeNode: null | TNativeAudioBufferSourceNode;

    private _proxy: IAudioBufferSourceNode;

    private _start: null | { duration?: number, offset: number, when: number };

    constructor (proxy: IAudioBufferSourceNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
        this._start = null;
    }

    public set start (value: { duration?: number, offset: number, when: number }) {
        this._start = value;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return Promise.resolve(this._nativeNode);
        }

        this._nativeNode = <TNativeAudioBufferSourceNode> getNativeNode(this._proxy);

        // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
        if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
            this._nativeNode = offlineAudioContext.createBufferSource();
            this._nativeNode.buffer = (this._proxy.buffer === null) ? null : this._proxy.buffer;

            if (this._start !== null) {
                const { duration, offset, when } = this._start;

                if (duration === undefined) {
                    this._nativeNode.start(when, offset);
                } else {
                    this._nativeNode.start(when, offset, duration);
                }
            }
        }

        return this
            ._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode)
            .then(() => <TNativeAudioNode> this._nativeNode);
    }

}
