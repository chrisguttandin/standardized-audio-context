import { AudioParam } from '../audio-param';
import { createInvalidStateError } from '../factories/invalid-state-error';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { createNativeAudioBufferSourceNode } from '../helpers/create-native-audio-buffer-source-node';
import { getNativeContext } from '../helpers/get-native-context';
import { IAudioBufferSourceNode, IAudioBufferSourceOptions, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { AudioBufferSourceNodeRenderer } from '../renderers/audio-buffer-source-node';
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
    isNativeOfflineAudioContext,
    noneAudioDestinationNodeConstructor
) => {

    return class AudioBufferSourceNode extends noneAudioDestinationNodeConstructor implements IAudioBufferSourceNode {

        private _audioBufferSourceNodeRenderer: null | AudioBufferSourceNodeRenderer;

        private _detune: IAudioParam;

        private _isBufferNullified: boolean;

        private _isBufferSet: boolean;

        private _nativeNode: TNativeAudioBufferSourceNode;

        private _playbackRate: IAudioParam;

        constructor (context: IMinimalBaseAudioContext, options: Partial<IAudioBufferSourceOptions> = DEFAULT_OPTIONS) {
            const nativeContext = getNativeContext(context);
            const mergedOptions = <IAudioBufferSourceOptions> { ...DEFAULT_OPTIONS, ...options };
            const nativeNode = createNativeAudioBufferSourceNode(nativeContext, mergedOptions);

            super(context, nativeNode);

            this._detune = new AudioParam({
                context,
                isAudioParamOfOfflineAudioContext: isNativeOfflineAudioContext(nativeContext),
                maxValue: null,
                minValue: null,
                nativeAudioParam: nativeNode.detune
            });
            this._nativeNode = nativeNode;
            // Bug #73: Edge, Firefox & Safari do not export the correct values for maxValue and minValue.
            this._playbackRate = new AudioParam({
                context,
                isAudioParamOfOfflineAudioContext: isNativeOfflineAudioContext(nativeContext),
                maxValue: 3.4028234663852886e38,
                minValue: -3.4028234663852886e38,
                nativeAudioParam: nativeNode.playbackRate
            });

            if (isNativeOfflineAudioContext(nativeContext)) {
                const audioBufferSourceNodeRenderer = new AudioBufferSourceNodeRenderer(this);

                AUDIO_NODE_RENDERER_STORE.set(this, audioBufferSourceNodeRenderer);

                this._audioBufferSourceNodeRenderer = audioBufferSourceNodeRenderer;
            } else {
                this._audioBufferSourceNodeRenderer = null;
            }

            this._isBufferNullified = false;
            this._isBufferSet = false;
            this._nativeNode = nativeNode;
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
