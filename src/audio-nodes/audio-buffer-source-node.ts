import { Injector } from '@angular/core';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioBuffer, IAudioBufferSourceNode, IAudioBufferSourceOptions, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { AudioBufferSourceNodeRenderer } from '../renderers/audio-buffer-source-node';
import { STOP_STOPPED_SUPPORT_TESTER_PROVIDER, StopStoppedSupportTester } from '../support-testers/stop-stopped';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TEndedEventHandler,
    TNativeAudioBufferSourceNode,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import {
    AUDIO_BUFFER_SOURCE_NODE_STOP_METHOD_WRAPPER_PROVIDER,
    AudioBufferSourceNodeStopMethodWrapper
} from '../wrappers/audio-buffer-source-node-stop-method';
import { AUDIO_PARAM_WRAPPER_PROVIDER, AudioParamWrapper } from '../wrappers/audio-param';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const injector = Injector.create({
    providers: [
        AUDIO_BUFFER_SOURCE_NODE_STOP_METHOD_WRAPPER_PROVIDER,
        AUDIO_PARAM_WRAPPER_PROVIDER,
        STOP_STOPPED_SUPPORT_TESTER_PROVIDER
    ]
});

const audioBufferSourceNodeStopMethodWrapper = injector.get(AudioBufferSourceNodeStopMethodWrapper);
const audioParamWrapper = injector.get(AudioParamWrapper);
const stopStoppedSupportTester = injector.get(StopStoppedSupportTester);

const createNativeNode = (nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext) => {
    const nativeNode = nativeContext.createBufferSource();

    // Bug #19: Safari does not ignore calls to stop() of an already stopped AudioBufferSourceNode.
    if (!cacheTestResult(StopStoppedSupportTester, () => stopStoppedSupportTester.test(nativeContext))) {
        audioBufferSourceNodeStopMethodWrapper.wrap(nativeNode, nativeContext);
    }

    return nativeNode;
};

const DEFAULT_OPTIONS: IAudioBufferSourceOptions = {
    buffer: null,
    channelCount: 2, // @todo channelCount is not specified because it is ignored when the channelCountMode equals 'max'.
    channelCountMode: <TChannelCountMode> 'max',
    channelInterpretation: <TChannelInterpretation> 'speakers',
    detune: 0,
    loop: false,
    loopEnd: 0,
    loopStart: 0,
    numberOfInputs: 0,
    numberOfOutputs: 1,
    playbackRate: 1
};

export class AudioBufferSourceNode extends NoneAudioDestinationNode<TNativeAudioBufferSourceNode> implements IAudioBufferSourceNode {

    private _buffer: null | IAudioBuffer;

    constructor (context: IMinimalBaseAudioContext, options: Partial<IAudioBufferSourceOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IAudioBufferSourceOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeNode(nativeContext);

        super(context, nativeNode, mergedOptions);

        // @todo Set all the other options.
        // @todo this.buffer = options.buffer;
        this._buffer = null;

        if (isOfflineAudioContext(nativeContext)) {
            const audioBufferSourceNodeRenderer = new AudioBufferSourceNodeRenderer(this);

            AUDIO_NODE_RENDERER_STORE.set(this, audioBufferSourceNodeRenderer);

            audioParamWrapper.wrap(nativeNode, 'detune');
            audioParamWrapper.wrap(nativeNode, 'playbackRate');
        }
    }

    public get buffer () {
        return this._buffer;
    }

    public set buffer (value) {
        this._buffer = value;
        // @todo Allow to set the buffer only once.
        if (this._nativeNode !== null) {
            this._nativeNode.buffer = value;
        }
    }

    public get onended (): null | TEndedEventHandler {
        // @todo
        return (this._nativeNode === null) ? null : <TEndedEventHandler> (<any> this._nativeNode).onended;
    }

    public set onended (value: null | TEndedEventHandler) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<any> this._nativeNode).onended = value;
        }
    }

    public get detune (): IAudioParam {
        if (this._nativeNode === null) {
            throw new Error('The associated nativeNode is missing.');
        }

        return <IAudioParam> (<any> this._nativeNode.detune);
    }

    public get loop () {
        // @todo
        return (this._nativeNode === null) ? false : this._nativeNode.loop;
    }

    public set loop (value) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            this._nativeNode.loop = value;
        }
    }

    public get loopEnd () {
        // @todo
        return (this._nativeNode === null) ? 0 : this._nativeNode.loopEnd;
    }

    public set loopEnd (value) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            this._nativeNode.loopEnd = value;
        }
    }

    public get loopStart () {
        // @todo
        return (this._nativeNode === null) ? 0 : this._nativeNode.loopStart;
    }

    public set loopStart (value) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            this._nativeNode.loopStart = value;
        }
    }

    public get playbackRate (): IAudioParam {
        if (this._nativeNode === null) {
            throw new Error('The associated nativeNode is missing.');
        }

        return <IAudioParam> (<any> this._nativeNode.playbackRate);
    }

    public start (when = 0, offset = 0, duration?: number) {
        const audioBufferSourceNodeRenderer = AUDIO_NODE_RENDERER_STORE.get(this);

        if (audioBufferSourceNodeRenderer !== undefined) {
            (<AudioBufferSourceNodeRenderer> audioBufferSourceNodeRenderer).start = { duration, offset, when };
        }

        if (this._nativeNode === null) {
            throw new Error('The associated nativeNode is missing.');
        }

        this._nativeNode.start(when, offset, duration);
    }

    public stop (when = 0) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            this._nativeNode.stop(when);
        }
    }

}
