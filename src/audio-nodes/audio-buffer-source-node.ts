import { Injector } from '@angular/core';
import { AUDIO_NODE_RENDERER_STORE } from '../globals';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioBufferSourceNode, IAudioBufferSourceOptions, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
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

    constructor (context: IMinimalBaseAudioContext, options: Partial<IAudioBufferSourceOptions> = DEFAULT_OPTIONS) {
        const nativeContext = getNativeContext(context);
        const mergedOptions = <IAudioBufferSourceOptions> { ...DEFAULT_OPTIONS, ...options };
        const nativeNode = createNativeNode(nativeContext);

        super(context, nativeNode, mergedOptions);

        // @todo Set all the other options.
        // @todo this.buffer = options.buffer;

        if (isOfflineAudioContext(nativeContext)) {
            const audioBufferSourceNodeRenderer = new AudioBufferSourceNodeRenderer(this);

            AUDIO_NODE_RENDERER_STORE.set(this, audioBufferSourceNodeRenderer);

            audioParamWrapper.wrap(nativeNode, context, 'detune');
            audioParamWrapper.wrap(nativeNode, context, 'playbackRate');
        }
    }

    public get buffer () {
        return this._nativeNode.buffer;
    }

    public set buffer (value) {
        // @todo Allow to set the buffer only once.
        this._nativeNode.buffer = value;
    }

    public get onended () {
        return <TEndedEventHandler> (<any> this._nativeNode.onended);
    }

    public set onended (value) {
        this._nativeNode.onended = <any> value;
    }

    public get detune () {
        return <IAudioParam> (<any> this._nativeNode.detune);
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
        return <IAudioParam> (<any> this._nativeNode.playbackRate);
    }

    public start (when = 0, offset = 0, duration?: number) {
        const audioBufferSourceNodeRenderer = AUDIO_NODE_RENDERER_STORE.get(this);

        if (audioBufferSourceNodeRenderer !== undefined) {
            (<AudioBufferSourceNodeRenderer> audioBufferSourceNodeRenderer).start = { duration, offset, when };
        }

        this._nativeNode.start(when, offset, duration);
    }

    public stop (when = 0) {
        this._nativeNode.stop(when);
    }

}
