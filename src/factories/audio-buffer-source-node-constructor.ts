import { isActiveAudioNode } from '../helpers/is-active-audio-node';
import { setInternalStateToActive } from '../helpers/set-internal-state-to-active';
import { setInternalStateToPassive } from '../helpers/set-internal-state-to-passive';
import { IAudioBufferSourceNode, IAudioBufferSourceOptions, IAudioParam, IAudioScheduledSourceNodeEventMap } from '../interfaces';
import {
    TAnyAudioBuffer,
    TAudioBufferSourceNodeConstructorFactory,
    TAudioNodeRenderer,
    TContext,
    TEventHandler,
    TNativeAudioBufferSourceNode
} from '../types';

const DEFAULT_OPTIONS = {
    buffer: null,
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    detune: 0,
    loop: false,
    loopEnd: 0,
    loopStart: 0,
    playbackRate: 1
} as const;

export const createAudioBufferSourceNodeConstructor: TAudioBufferSourceNodeConstructorFactory = (
    audioNodeConstructor,
    createAudioBufferSourceNodeRenderer,
    createAudioParam,
    createNativeAudioBufferSourceNode,
    getNativeContext,
    isNativeOfflineAudioContext,
    wrapEventListener
) => {
    return class AudioBufferSourceNode<T extends TContext>
        extends audioNodeConstructor<T, IAudioScheduledSourceNodeEventMap>
        implements IAudioBufferSourceNode<T>
    {
        private _detune: IAudioParam;

        private _nativeAudioBufferSourceNode: TNativeAudioBufferSourceNode;

        private _onended: null | TEventHandler<this>;

        private _playbackRate: IAudioParam;

        constructor(context: T, options?: Partial<IAudioBufferSourceOptions>) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeAudioBufferSourceNode = createNativeAudioBufferSourceNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const audioBufferSourceNodeRenderer = <TAudioNodeRenderer<T, this>>(isOffline ? createAudioBufferSourceNodeRenderer() : null);

            super(context, false, nativeAudioBufferSourceNode, audioBufferSourceNodeRenderer);

            this._detune = createAudioParam(this, isOffline, nativeAudioBufferSourceNode.detune);
            this._nativeAudioBufferSourceNode = nativeAudioBufferSourceNode;
            this._onended = null;
            this._playbackRate = createAudioParam(this, isOffline, nativeAudioBufferSourceNode.playbackRate);
        }

        get buffer(): null | TAnyAudioBuffer {
            return this._nativeAudioBufferSourceNode.buffer;
        }

        set buffer(value) {
            this._nativeAudioBufferSourceNode.buffer = value;
        }

        get detune(): IAudioParam {
            return this._detune;
        }

        get loop(): boolean {
            return this._nativeAudioBufferSourceNode.loop;
        }

        set loop(value) {
            this._nativeAudioBufferSourceNode.loop = value;
        }

        get loopEnd(): number {
            return this._nativeAudioBufferSourceNode.loopEnd;
        }

        set loopEnd(value) {
            this._nativeAudioBufferSourceNode.loopEnd = value;
        }

        get loopStart(): number {
            return this._nativeAudioBufferSourceNode.loopStart;
        }

        set loopStart(value) {
            this._nativeAudioBufferSourceNode.loopStart = value;
        }

        get onended(): null | TEventHandler<this> {
            return this._onended;
        }

        set onended(value) {
            const wrappedListener = typeof value === 'function' ? wrapEventListener(this, value) : null;

            this._nativeAudioBufferSourceNode.onended = wrappedListener;

            const nativeOnEnded = this._nativeAudioBufferSourceNode.onended;

            this._onended = nativeOnEnded !== null && nativeOnEnded === wrappedListener ? value : nativeOnEnded;
        }

        get playbackRate(): IAudioParam {
            return this._playbackRate;
        }

        public start(when = 0, offset = 0, duration?: number): void {
            this._nativeAudioBufferSourceNode.start(when, offset, duration);

            if (this.context.state !== 'closed') {
                setInternalStateToActive(this);

                const resetInternalStateToPassive = () => {
                    this._nativeAudioBufferSourceNode.removeEventListener('ended', resetInternalStateToPassive);

                    if (isActiveAudioNode(this)) {
                        setInternalStateToPassive(this);
                    }
                };

                this._nativeAudioBufferSourceNode.addEventListener('ended', resetInternalStateToPassive);
            }
        }

        public stop(when = 0): void {
            this._nativeAudioBufferSourceNode.stop(when);
        }
    };
};
