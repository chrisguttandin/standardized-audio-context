import { getNativeContext } from '../helpers/get-native-context';
import {
    IAudioBufferSourceNode,
    IAudioBufferSourceNodeRenderer,
    IAudioBufferSourceOptions,
    IAudioParam,
    IMinimalBaseAudioContext
} from '../interfaces';
import {
    TAudioBufferSourceNodeConstructorFactory,
    TChannelCountMode,
    TChannelInterpretation,
    TEndedEventHandler,
    TNativeAudioBufferSourceNode
} from '../types';

const DEFAULT_OPTIONS: IAudioBufferSourceOptions = {
    buffer: null,
    channelCount: 2,
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    detune: 0,
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

        private _detune: IAudioParam;

        private _isBufferNullified: boolean;

        private _isBufferSet: boolean;

        private _nativeNode: TNativeAudioBufferSourceNode;

        private _playbackRate: IAudioParam;

        constructor (context: IMinimalBaseAudioContext, options: Partial<IAudioBufferSourceOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IAudioBufferSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = createNativeAudioBufferSourceNode(nativeContext, mergedOptions);
            const isOffline = isNativeOfflineAudioContext(nativeContext);
            const audioBufferSourceNodeRenderer = (isOffline) ? createAudioBufferSourceNodeRenderer() : null;

            super(context, nativeNode, audioBufferSourceNodeRenderer);

            this._audioBufferSourceNodeRenderer = audioBufferSourceNodeRenderer;
            this._detune = createAudioParam(context, isOffline, nativeNode.detune);
            this._isBufferNullified = false;
            this._isBufferSet = false;
            this._nativeNode = nativeNode;
            // Bug #73: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._playbackRate = createAudioParam(
                context,
                isOffline,
                nativeNode.playbackRate,
                3.4028234663852886e38,
                -3.4028234663852886e38
            );
        }

        public get buffer () {
            if (this._isBufferNullified) {
                return null;
            }

            return this._nativeNode.buffer;
        }

        public set buffer (value) {
            // Bug #71: Edge does not allow to set the buffer to null.
            try {
                this._nativeNode.buffer = value;
            } catch (err) {
                if (value !== null || err.code !== 17) {
                    throw err;
                }

                // @todo Create a new internal nativeNode.
                this._isBufferNullified = (this._nativeNode.buffer !== null);
            }

            // Bug #72: Only Chrome, Edge & Opera do not allow to reassign the buffer yet.
            if (value !== null) {
                if (this._isBufferSet) {
                    throw createInvalidStateError();
                }

                this._isBufferSet = true;
            }
        }

        public get onended () {
            return <TEndedEventHandler> (<any> this._nativeNode.onended);
        }

        public set onended (value) {
            this._nativeNode.onended = <any> value;
        }

        public get detune () {
            return this._detune;
        }

        public get loop () {
            return this._nativeNode.loop;
        }

        public set loop (value) {
            this._nativeNode.loop = value;
        }

        public get loopEnd () {
            return this._nativeNode.loopEnd;
        }

        public set loopEnd (value) {
            this._nativeNode.loopEnd = value;
        }

        public get loopStart () {
            return this._nativeNode.loopStart;
        }

        public set loopStart (value) {
            this._nativeNode.loopStart = value;
        }

        public get playbackRate () {
            return this._playbackRate;
        }

        public start (when = 0, offset = 0, duration?: number) {
            this._nativeNode.start(when, offset, duration);

            if (this._audioBufferSourceNodeRenderer !== null) {
                this._audioBufferSourceNodeRenderer.start = (duration === undefined) ? [ when, offset ] : [ when, offset, duration ];
            }
        }

        public stop (when = 0) {
            this._nativeNode.stop(when);

            if (this._audioBufferSourceNodeRenderer !== null) {
                this._audioBufferSourceNodeRenderer.stop = when;
            }
        }

    };

};
