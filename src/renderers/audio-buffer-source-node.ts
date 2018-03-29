import { createNativeAudioBufferSourceNode } from '../helpers/create-native-audio-buffer-source-node';
import { getNativeNode } from '../helpers/get-native-node';
import { isOwnedByContext } from '../helpers/is-owned-by-context';
import { IAudioBufferSourceNode, IAudioBufferSourceOptions } from '../interfaces';
import { TNativeAudioBufferSourceNode, TNativeAudioNode, TUnpatchedOfflineAudioContext } from '../types';
import { AudioNodeRenderer } from './audio-node';

export class AudioBufferSourceNodeRenderer extends AudioNodeRenderer {

    private _nativeNode: null | TNativeAudioBufferSourceNode;

    private _proxy: IAudioBufferSourceNode;

    private _start: null | [ number, number ] | [ number, number, number ];

    private _stop: null | number;

    constructor (proxy: IAudioBufferSourceNode) {
        super();

        this._nativeNode = null;
        this._proxy = proxy;
        this._start = null;
        this._stop = null;
    }

    public set start (value: [ number, number ] | [ number, number, number ]) {
        this._start = value;
    }

    public set stop (value: number) {
        this._stop = value;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext): Promise<TNativeAudioNode> {
        if (this._nativeNode !== null) {
            return Promise.resolve(this._nativeNode);
        }

        this._nativeNode = <TNativeAudioBufferSourceNode> getNativeNode(this._proxy);

        // If the initially used nativeNode was not constructed on the same OfflineAudioContext it needs to be created again.
        if (!isOwnedByContext(this._nativeNode, offlineAudioContext)) {
            const options: IAudioBufferSourceOptions = {
                buffer: this._nativeNode.buffer,
                channelCount: this._nativeNode.channelCount,
                channelCountMode: this._nativeNode.channelCountMode,
                channelInterpretation: this._nativeNode.channelInterpretation,
                detune: 0, // @todo this._nativeNode.detune.value,
                loop: this._nativeNode.loop,
                loopEnd: this._nativeNode.loopEnd,
                loopStart: this._nativeNode.loopStart,
                playbackRate: this._nativeNode.playbackRate.value
            };

            this._nativeNode = createNativeAudioBufferSourceNode(offlineAudioContext, options);

            if (this._start !== null) {
                this._nativeNode.start(...this._start);
            }

            if (this._stop !== null) {
                this._nativeNode.stop(this._stop);
            }
        }

        return this
            ._connectSources(offlineAudioContext, <TNativeAudioNode> this._nativeNode)
            .then(() => <TNativeAudioNode> this._nativeNode);
    }

}
