import { Inject, Injectable } from '@angular/core';
import {
    IAudioNode,
    IIIRFilterNode,
    IOfflineAudioContext,
    IOfflineAudioNodeFaker,
    IUnpatchedOfflineAudioContextConstructor
} from '../interfaces';
import { OfflineAudioNodeProxy } from '../offline-audio-node';
import { unpatchedOfflineAudioContextConstructor } from '../providers/unpatched-offline-audio-context-constructor';
import { PromiseSupportTester } from '../testers/promise-support';
import { TUnpatchedOfflineAudioContext } from '../types';
import { InvalidStateErrorFactory } from './invalid-state-error';
import { NotSupportedErrorFactory } from './not-supported-error';

function divide (a: number[], b: number[]) {
    const denominator = (b[0] * b[0]) + (b[1] * b[1]);

    return [ (((a[0] * b[0]) + (a[1] * b[1])) / denominator), (((a[1] * b[0]) - (a[0] * b[1])) / denominator) ];
}

function multiply (a: number[], b: number[]) {
    return [ ((a[0] * b[0]) - (a[1] * b[1])), ((a[0] * b[1]) + (a[1] * b[0])) ];
}

function evaluatePolynomial (coefficient: number[], z: number[]) {
    let result = [ 0, 0 ];

    for (let i = coefficient.length - 1; i >= 0; i -= 1) {
        result = multiply(result, z);

        result[0] += coefficient[i];
    }

    return result;
}

export interface IOfflineIIRFilterNodeProxyOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    feedback: number[];

    feedforward: number[];

    nativeNode: null | IIIRFilterNode;

    notSupportedErrorFactory: NotSupportedErrorFactory;

    offlineAudioContext: IOfflineAudioContext;

    sampleRate: number;

}

export class OfflineIIRFilterNodeProxy extends OfflineAudioNodeProxy implements IIIRFilterNode {

    private _feedback: number[];

    private _feedforward: number[];

    private _nativeNode: null | IIIRFilterNode;

    private _notSupportedErrorFactory: NotSupportedErrorFactory;

    private _nyquist: number;

    constructor ({
        fakeNodeStore, feedback, feedforward, nativeNode, notSupportedErrorFactory, offlineAudioContext, sampleRate
    }: IOfflineIIRFilterNodeProxyOptions) {
        super({
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fakeNodeStore,
            numberOfInputs: 1,
            numberOfOutputs: 1,
            offlineAudioContext
        });

        this._feedback = feedback;
        this._feedforward = feedforward;
        this._nativeNode = nativeNode;
        this._notSupportedErrorFactory = notSupportedErrorFactory;
        this._nyquist = sampleRate / 2;
    }

    public getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) {
        // Bug #9: Safari does not support IIRFilterNodes.
        if (this._nativeNode !== null) {
            return this._nativeNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
        }

        if (magResponse.length === 0 || phaseResponse.length === 0) {
            throw this._notSupportedErrorFactory.create();
        }

        const length = frequencyHz.length;

        for (let i = 0; i < length; i += 1) {
            const omega = -Math.PI * (frequencyHz[i] / this._nyquist);

            const z = [ Math.cos(omega), Math.sin(omega) ];

            const numerator = evaluatePolynomial(this._feedforward, z);

            const denominator = evaluatePolynomial(this._feedback, z);

            const response = divide(numerator, denominator);

            magResponse[i] = Math.sqrt((response[0] * response[0]) + (response[1] * response[1]));
            phaseResponse[i] = Math.atan2(response[1], response[0]);
        }
    }

}

export interface IOfflineIIRFilterNodeFakerOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    feedback: number[];

    feedforward: number[];

    invalidStateErrorFactory: InvalidStateErrorFactory;

    length: number;

    nativeNode: null | IIIRFilterNode;

    notSupportedErrorFactory: NotSupportedErrorFactory;

    numberOfChannels: number;

    offlineAudioContext: IOfflineAudioContext;

    promiseSupportTester: PromiseSupportTester;

    sampleRate: number;

    unpatchedOfflineAudioContextConstructor: IUnpatchedOfflineAudioContextConstructor;

}

export class OfflineIIRFilterNodeFaker implements IOfflineAudioNodeFaker {

    private _feedback: number[];

    private _feedforward: number[];

    private _invalidStateErrorFactory: InvalidStateErrorFactory;

    private _length: number;

    private _nativeNode: null | IIIRFilterNode;

    private _node: null | AudioNode;

    private _notSupportedErrorFactory: NotSupportedErrorFactory;

    private _numberOfChannels: number;

    private _promiseSupportTester: PromiseSupportTester;

    private _proxy: OfflineIIRFilterNodeProxy;

    private _sources: Map<IOfflineAudioNodeFaker, { input: number, output: number }>;

    private _unpatchedOfflineAudioContextConstructor: IUnpatchedOfflineAudioContextConstructor;

    constructor ({
        fakeNodeStore,
        feedback,
        feedforward,
        invalidStateErrorFactory,
        length,
        nativeNode,
        notSupportedErrorFactory,
        numberOfChannels,
        offlineAudioContext,
        promiseSupportTester,
        sampleRate,
        unpatchedOfflineAudioContextConstructor
    }: IOfflineIIRFilterNodeFakerOptions) {
        if (feedback.length === 0 || feedback.length > 20) {
            throw notSupportedErrorFactory.create();
        }

        if (feedback[0] === 0) {
            throw invalidStateErrorFactory.create();
        }

        if (feedforward.length === 0 || feedforward.length > 20) {
            throw notSupportedErrorFactory.create();
        }

        if (feedforward[0] === 0) {
            throw invalidStateErrorFactory.create();
        }

        this._feedback = feedback;
        this._feedforward = feedforward;
        this._invalidStateErrorFactory = invalidStateErrorFactory;
        this._length = length;
        this._nativeNode = nativeNode;
        this._node = null;
        this._notSupportedErrorFactory = notSupportedErrorFactory;
        this._numberOfChannels = numberOfChannels;
        this._promiseSupportTester = promiseSupportTester;
        this._proxy = new OfflineIIRFilterNodeProxy({
            fakeNodeStore,
            feedback,
            feedforward,
            nativeNode,
            notSupportedErrorFactory,
            offlineAudioContext,
            sampleRate
        });
        this._sources = new Map();
        this._unpatchedOfflineAudioContextConstructor = unpatchedOfflineAudioContextConstructor;

        fakeNodeStore.set(this._proxy, this);
    }

    public get proxy () {
        return this._proxy;
    }

    private _applyFilter (renderedBuffer: AudioBuffer, offlineAudioContext: TUnpatchedOfflineAudioContext) {
        let bufferIndex = 0;

        const bufferLength = 32;

        const feedback = this._feedback;

        const feedbackLength = this._feedback.length;

        const feedforward = this._feedforward;

        const feedforwardLength = this._feedforward.length;

        if (feedforward.length === 0 || feedforward.length > 20 || feedback.length === 0 || feedback.length > 20) {
            throw this._notSupportedErrorFactory.create();
        }

        if (feedforward[0] === 0 || feedback[0] === 0) {
            throw this._invalidStateErrorFactory.create();
        }

        if (feedback[0] !== 1) {
            for (let i = 0; i < feedbackLength; i += 1) {
                feedforward[i] /= feedback[0];
            }

            for (let i = 1; i < feedforwardLength; i += 1) {
                feedback[i] /= feedback[0];
            }
        }

        const xBuffer = new Float32Array(bufferLength);
        const yBuffer = new Float32Array(bufferLength);

        const minLength = Math.min(feedbackLength, feedforwardLength);

        const filteredBuffer = offlineAudioContext.createBuffer(
            renderedBuffer.numberOfChannels,
            renderedBuffer.length,
            renderedBuffer.sampleRate
        );

        // This implementation as shamelessly inspired by source code of
        // tslint:disable-next-line:max-line-length
        // {@link https://chromium.googlesource.com/chromium/src.git/+/master/third_party/WebKit/Source/platform/audio/IIRFilter.cpp|Chromium's IIRFilter}.
        const numberOfChannels = renderedBuffer.numberOfChannels;

        for (let i = 0; i < numberOfChannels; i += 1) {
            const input = renderedBuffer.getChannelData(i);

            const output = filteredBuffer.getChannelData(i);

            // @todo Use TypedArray.prototype.fill() once it lands in Safari.
            for (let j = 0; j < bufferLength; j += 1) {
                xBuffer[j] = 0;
                yBuffer[j] = 0;
            }

            const inputLength = input.length;

            for (let j = 0; j < inputLength; j += 1) {
                let y = feedforward[0] * input[j];

                for (let k = 1; k < minLength; k += 1) {
                    const x = (bufferIndex - k) & (bufferLength - 1); // tslint:disable-line:no-bitwise

                    y += feedforward[k] * xBuffer[x];
                    y -= feedback[k] * yBuffer[x];
                }

                for (let k = minLength; k < feedforwardLength; k += 1) {
                    y += feedforward[k] * xBuffer[(bufferIndex - k) & (bufferLength - 1)]; // tslint:disable-line:no-bitwise
                }

                for (let k = minLength; k < feedbackLength; k += 1) {
                    y -= feedback[k] * yBuffer[(bufferIndex - k) & (bufferLength - 1)]; // tslint:disable-line:no-bitwise
                }

                xBuffer[bufferIndex] = input[j];
                yBuffer[bufferIndex] = y;

                bufferIndex = (bufferIndex + 1) & (bufferLength - 1); // tslint:disable-line:no-bitwise

                output[j] = y;
            }
        }

        return filteredBuffer;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext) {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        // Bug #9: Safari does not support IIRFilterNodes.
        if (this._nativeNode) {
            this._node = offlineAudioContext.createIIRFilter(this._feedforward, this._feedback);

            const promises = Array
                .from(this._sources)
                .map(([ source, { input, output } ]) => {
                    /*
                     * For some reason this currently needs to be a function body with a return statement. The shortcut syntax causes an
                     * error.
                     */
                    return source
                        .render(offlineAudioContext)
                        .then((node) => node.connect(<IIRFilterNode> this._node, output, input));
                });

            return Promise
                .all(promises)
                .then(() => this._node);
        }

        // @todo Somehow retrieve the number of channels.
        const partialOfflineAudioContext = new this._unpatchedOfflineAudioContextConstructor(
            this._numberOfChannels,
            this._length,
            offlineAudioContext.sampleRate
        );

        const promises = Array
            .from(this._sources)
            .map(([ source, { input, output } ]) => {
                // For some reason this currently needs to be a function body with a return statement. The shortcut syntax causes an error.
                return source
                    .render(partialOfflineAudioContext)
                    .then((node) => node.connect(partialOfflineAudioContext.destination, output, input));
            });

        return Promise
            .all(promises)
            .then(() => {
                // Bug #21: Safari does not support promises yet.
                if (this._promiseSupportTester.test(partialOfflineAudioContext)) {
                    return partialOfflineAudioContext.startRendering();
                }

                return new Promise((resolve) => {
                    partialOfflineAudioContext.oncomplete = (event) => resolve(event.renderedBuffer);

                    partialOfflineAudioContext.startRendering();
                });
            })
            .then((renderedBuffer) => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBufferSourceNode.buffer = this._applyFilter(renderedBuffer, offlineAudioContext);
                audioBufferSourceNode.start(0);

                this._node = audioBufferSourceNode;

                return this._node;
            });
    }

    public wire (source: IOfflineAudioNodeFaker, output: number, input: number) {
        this._sources.set(source, { input, output });

        return this._proxy;
    }

    public unwire (source: IOfflineAudioNodeFaker) {
        this._sources.delete(source);
    }

}

export interface IOfflineIIRFilterNodeFakerFactoryOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    feedback: number[];

    feedforward: number[];

    length: number;

    nativeNode: null | IIIRFilterNode;

    numberOfChannels: number;

    offlineAudioContext: IOfflineAudioContext;

    sampleRate: number;

}

@Injectable()
export class OfflineIIRFilterNodeFakerFactory {

    constructor (
        @Inject(unpatchedOfflineAudioContextConstructor)
        private _unpatchedOfflineAudioContextConstructor: IUnpatchedOfflineAudioContextConstructor,
        private _invalidStateErrorFactory: InvalidStateErrorFactory,
        private _notSupportedErrorFactory: NotSupportedErrorFactory,
        private _promiseSupportTester: PromiseSupportTester
    ) { }

    public create ({
        fakeNodeStore, feedback, feedforward, length, nativeNode, numberOfChannels, offlineAudioContext, sampleRate
    }: IOfflineIIRFilterNodeFakerFactoryOptions) {
        return new OfflineIIRFilterNodeFaker({
            fakeNodeStore,
            feedback,
            feedforward,
            invalidStateErrorFactory: this._invalidStateErrorFactory,
            length,
            nativeNode,
            notSupportedErrorFactory: this._notSupportedErrorFactory,
            numberOfChannels,
            offlineAudioContext,
            promiseSupportTester: this._promiseSupportTester,
            sampleRate,
            unpatchedOfflineAudioContextConstructor: this._unpatchedOfflineAudioContextConstructor
        });
    }

}
