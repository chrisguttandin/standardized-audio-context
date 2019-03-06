import { MOST_NEGATIVE_SINGLE_FLOAT, MOST_POSITIVE_SINGLE_FLOAT } from '../constants';
import { getNativeContext } from '../helpers/get-native-context';
import { wrapEventListener } from '../helpers/wrap-event-listener';
import { IAudioBufferSourceNode, IAudioBufferSourceNodeRenderer, IAudioBufferSourceOptions, IAudioParam } from '../interfaces';
import {
    TAnyAudioBuffer,
    TAudioBufferSourceNodeConstructorFactory,
    TContext,
    TEndedEventHandler,
    TNativeAudioBufferSourceNode
} from '../types';

const DEFAULT_OPTIONS: IAudioBufferSourceOptions = {
    buffer: null,
    channelCount: 2,
    channelCountMode: 'max',
    channelInterpretation: 'speakers',
    // Bug #149: Safari does not yet support the detune AudioParam.
    loop: false,
    loopEnd: 0,
    loopStart: 0,
    playbackRate: 1
};

export const createAudioBufferSourceNodeConstructor: TAudioBufferSourceNodeConstructorFactory = (
    createAudioBufferSourceNodeRenderer,
    createAudioParam,
    createInvalidStateError,
    createNativeAudioBufferSourceNode,
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class AudioBufferSourceNode extends noneAudioDestinationNodeConstructor implements IAudioBufferSourceNode {

        private _audioBufferSourceNodeRenderer: null | IAudioBufferSourceNodeRenderer;

        private _isBufferNullified: boolean;

        private _isBufferSet: boolean;

        private _nativeAudioBufferSourceNode: TNativeAudioBufferSourceNode;

        private _onended: null | TEndedEventHandler<IAudioBufferSourceNode>;

        private _playbackRate: IAudioParam;

        constructor (context: TContext, options: Partial<IAudioBufferSourceOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
            const nativeAudioBufferSourceNode = createNativeAudioBufferSourceNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const audioBufferSourceNodeRenderer = (isOffline) ? createAudioBufferSourceNodeRenderer() : null;

            super(context, nativeAudioBufferSourceNode, audioBufferSourceNodeRenderer);

            this._audioBufferSourceNodeRenderer = audioBufferSourceNodeRenderer;
            this._isBufferNullified = false;
            this._isBufferSet = false;
            this._nativeAudioBufferSourceNode = nativeAudioBufferSourceNode;
            this._onended = null;
            // Bug #73: Edge & Safari do not export the correct values for maxValue and minValue.
            this._playbackRate = createAudioParam(
                context,
                isOffline,
                nativeAudioBufferSourceNode.playbackRate,
                MOST_POSITIVE_SINGLE_FLOAT,
                MOST_NEGATIVE_SINGLE_FLOAT
            );
        }

        get buffer (): null | TAnyAudioBuffer {
            if (this._isBufferNullified) {
                return null;
            }

            return this._nativeAudioBufferSourceNode.buffer;
        }

        set buffer (value) {
            // Bug #71: Edge does not allow to set the buffer to null.
            try {
                this._nativeAudioBufferSourceNode.buffer = value;
            } catch (err) {
                if (value !== null || err.code !== 17) {
                    throw err; // tslint:disable-line:rxjs-throw-error
                }

                // This will modify the buffer in place. Luckily that works in Edge and has the same effect as setting the buffer to null.
                if (this._nativeAudioBufferSourceNode.buffer !== null) {
                    const buffer = this._nativeAudioBufferSourceNode.buffer;
                    const numberOfChannels = buffer.numberOfChannels;

                    for (let i = 0; i < numberOfChannels; i += 1) {
                        buffer
                            .getChannelData(i)
                            .fill(0);
                    }

                    this._isBufferNullified = true;
                }
            }

            // Bug #72: Only Chrome, Edge & Opera do not allow to reassign the buffer yet.
            if (value !== null) {
                if (this._isBufferSet) {
                    throw createInvalidStateError();
                }

                this._isBufferSet = true;
            }
        }

        get onended (): null | TEndedEventHandler<IAudioBufferSourceNode> {
            return this._onended;
        }

        set onended (value) {
            const wrappedListener = <TNativeAudioBufferSourceNode['onended']> wrapEventListener(this, value);

            this._nativeAudioBufferSourceNode.onended = wrappedListener;

            const nativeOnEnded = <null | TEndedEventHandler<IAudioBufferSourceNode>> this._nativeAudioBufferSourceNode.onended;

            this._onended = (nativeOnEnded === wrappedListener) ? value : nativeOnEnded;
        }

        get loop (): boolean {
            return this._nativeAudioBufferSourceNode.loop;
        }

        set loop (value) {
            this._nativeAudioBufferSourceNode.loop = value;
        }

        get loopEnd (): number {
            return this._nativeAudioBufferSourceNode.loopEnd;
        }

        set loopEnd (value) {
            this._nativeAudioBufferSourceNode.loopEnd = value;
        }

        get loopStart (): number {
            return this._nativeAudioBufferSourceNode.loopStart;
        }

        set loopStart (value) {
            this._nativeAudioBufferSourceNode.loopStart = value;
        }

        get playbackRate (): IAudioParam {
            return this._playbackRate;
        }

        public start (when = 0, offset = 0, duration?: number): void {
            this._nativeAudioBufferSourceNode.start(when, offset, duration);

            if (this._audioBufferSourceNodeRenderer !== null) {
                this._audioBufferSourceNodeRenderer.start = (duration === undefined) ? [ when, offset ] : [ when, offset, duration ];
            }
        }

        public stop (when = 0): void {
            this._nativeAudioBufferSourceNode.stop(when);

            if (this._audioBufferSourceNodeRenderer !== null) {
                this._audioBufferSourceNodeRenderer.stop = when;
            }
        }

    };

};
