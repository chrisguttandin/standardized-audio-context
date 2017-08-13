import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
import { RENDERER_STORE } from '../globals';
import { cacheTestResult } from '../helpers/cache-test-result';
import { getNativeContext } from '../helpers/get-native-context';
import { isOfflineAudioContext } from '../helpers/is-offline-audio-context';
import { IAudioBuffer, IAudioBufferSourceNode, IAudioBufferSourceOptions, IMinimalBaseAudioContext } from '../interfaces';
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
import { NoneAudioDestinationNode } from './none-audio-destination-node';

const injector = ReflectiveInjector.resolveAndCreate([
    AudioBufferSourceNodeStopMethodWrapper,
    StopStoppedSupportTester
]);

const audioBufferSourceNodeStopMethodWrapper = injector.get(AudioBufferSourceNodeStopMethodWrapper);
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
        const nativeNode = isOfflineAudioContext(nativeContext) ? null : createNativeNode(nativeContext);

        super(context, nativeNode, mergedOptions);

        // @todo Set all the other options.
        // @todo this.buffer = options.buffer;
        this._buffer = null;

        if (nativeNode === null) {
            const audioBufferSourceNodeRenderer = new AudioBufferSourceNodeRenderer(this);

            RENDERER_STORE.set(this, audioBufferSourceNodeRenderer);
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
        return (this._nativeNode === null) ? null : (<TNativeAudioBufferSourceNode> this._nativeNode).onended;
    }

    public set onended (value: null | TEndedEventHandler) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<any> this._nativeNode).onended = value;
        }
    }

    public get detune (): AudioParam {
        if (this._nativeNode !== null) {
            return (<TNativeAudioBufferSourceNode> this._nativeNode).detune;
        }

        // @todo Fake a proper AudioParam.
        const audioParam = {
            cancelScheduledValues: (startTime: number) => {
                startTime; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            defaultValue: 0,
            exponentialRampToValueAtTime: (value: number, endTime: number) => {
                endTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            linearRampToValueAtTime: (value: number, endTime: number) => {
                endTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setTargetAtTime: (target: number, startTime: number, timeConstant: number) => {
                startTime; // tslint:disable-line:no-unused-expression
                target; // tslint:disable-line:no-unused-expression
                timeConstant; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setValueAtTime: (value: number, startTime: number) => {
                startTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setValueCurveAtTime: (values: Float32Array, startTime: number, duration: number) => {
                duration; // tslint:disable-line:no-unused-expression
                startTime; // tslint:disable-line:no-unused-expression
                values; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            value: 0
        };

        return audioParam;
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

    public get playbackRate (): AudioParam {
        if (this._nativeNode !== null) {
            return (<TNativeAudioBufferSourceNode> this._nativeNode).playbackRate;
        }

        // @todo Fake a proper AudioParam.
        const audioParam = {
            cancelScheduledValues: (startTime: number) => {
                startTime; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            defaultValue: 1,
            exponentialRampToValueAtTime: (value: number, endTime: number) => {
                endTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            linearRampToValueAtTime: (value: number, endTime: number) => {
                endTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setTargetAtTime: (target: number, startTime: number, timeConstant: number) => {
                startTime; // tslint:disable-line:no-unused-expression
                target; // tslint:disable-line:no-unused-expression
                timeConstant; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setValueAtTime: (value: number, startTime: number) => {
                startTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setValueCurveAtTime: (values: Float32Array, startTime: number, duration: number) => {
                duration; // tslint:disable-line:no-unused-expression
                startTime; // tslint:disable-line:no-unused-expression
                values; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            value: 1
        };

        return audioParam;
    }

    public start (when = 0, offset = 0, duration?: number) {
        if (this._nativeNode === null) {
            const renderer = RENDERER_STORE.get(this);

            if (renderer === undefined) {
                throw new Error('Missing the associated renderer.');
            }

            (<AudioBufferSourceNodeRenderer> renderer).start = { duration, offset, when };
        } else {
            (<TNativeAudioBufferSourceNode> this._nativeNode).start(when, offset, duration);
        }
    }

    public stop (when = 0) {
        if (this._nativeNode === null) {
            // @todo
        } else {
            (<TNativeAudioBufferSourceNode> this._nativeNode).stop(when);
        }
    }

}
