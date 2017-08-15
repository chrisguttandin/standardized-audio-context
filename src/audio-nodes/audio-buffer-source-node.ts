import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
import { RENDERER_STORE } from '../globals';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioBuffer, IAudioBufferSourceNode, IAudioBufferSourceOptions, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { AudioBufferSourceNodeRenderer } from '../renderers/audio-buffer-source-node';
import { StopStoppedSupportTester } from '../testers/stop-stopped-support';
import {
    TChannelCountMode,
    TChannelInterpretation,
    TEndedEventHandler,
    TNativeAudioBufferSourceNode,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';
import { AudioBufferSourceNodeStopMethodWrapper } from '../wrappers/audio-buffer-source-node-stop-method';
import { AudioParamWrapper } from '../wrappers/audio-param';
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const injector = ReflectiveInjector.resolveAndCreate([
    AudioBufferSourceNodeStopMethodWrapper,
    AudioParamWrapper,
    StopStoppedSupportTester
]);

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

export class AudioBufferSourceNode extends NoneAudioDestinationNode implements IAudioBufferSourceNode {

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

            RENDERER_STORE.set(this, audioBufferSourceNodeRenderer);

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
            (<TNativeAudioBufferSourceNode> this._nativeNode).buffer = value;
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

        return <IAudioParam> (<any> this._nativeNode).detune;
    }

    public get loop () {
        // @todo
        return (this._nativeNode === null) ? false : (<TNativeAudioBufferSourceNode> this._nativeNode).loop;
    }

    public set loop (value) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<TNativeAudioBufferSourceNode> this._nativeNode).loop = value;
        }
    }

    public get loopEnd () {
        // @todo
        return (this._nativeNode === null) ? 0 : (<TNativeAudioBufferSourceNode> this._nativeNode).loopEnd;
    }

    public set loopEnd (value) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<TNativeAudioBufferSourceNode> this._nativeNode).loopEnd = value;
        }
    }

    public get loopStart () {
        // @todo
        return (this._nativeNode === null) ? 0 : (<TNativeAudioBufferSourceNode> this._nativeNode).loopStart;
    }

    public set loopStart (value) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<TNativeAudioBufferSourceNode> this._nativeNode).loopStart = value;
        }
    }

    public get playbackRate (): IAudioParam {
        if (this._nativeNode === null) {
            throw new Error('The associated nativeNode is missing.');
        }

        return <IAudioParam> (<any> this._nativeNode).playbackRate;
    }

    public start (when = 0, offset = 0, duration?: number) {
        const audioBufferSourceNodeRenderer = RENDERER_STORE.get(this);

        if (audioBufferSourceNodeRenderer !== undefined) {
            (<AudioBufferSourceNodeRenderer> audioBufferSourceNodeRenderer).start = { duration, offset, when };

        }

        (<TNativeAudioBufferSourceNode> this._nativeNode).start(when, offset, duration);
    }

    public stop (when = 0) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<TNativeAudioBufferSourceNode> this._nativeNode).stop(when);
        }
    }

}
