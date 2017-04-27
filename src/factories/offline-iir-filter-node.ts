import { Inject, Injectable } from '@angular/core';
import { OfflineAudioNodeProxy } from '../offline-audio-node';
import { unpatchedOfflineAudioContextConstructor } from '../providers/unpatched-offline-audio-context-constructor';
import { PromiseSupportTester } from '../testers/promise-support';
import { InvalidStateErrorFactory } from './invalid-state-error';
import { NotSupportedErrorFactory } from './not-supported-error';

function divide (a, b) {
    const denominator = (b[0] * b[0]) + (b[1] * b[1]);

    return [ (((a[0] * b[0]) + (a[1] * b[1])) / denominator), (((a[1] * b[0]) - (a[0] * b[1])) / denominator) ];
}

function multiply (a, b) {
    return [ ((a[0] * b[0]) - (a[1] * b[1])), ((a[0] * b[1]) + (a[1] * b[0])) ];
}

function evaluatePolynomial (coefficient, z) {
    let result = [ 0, 0 ];

    for (let i = coefficient.length - 1; i >= 0; i -= 1) {
        result = multiply(result, z);

        result[0] += coefficient[i];
    }

    return result;
}

class OfflineIIRFilterNodeProxy extends OfflineAudioNodeProxy {

    private _feedback;

    private _feedforward;

    private _nativeNode;

    private _notSupportedErrorFactory;

    private _nyquist;

    constructor ({ fakeNodeStore, feedback, feedforward, nativeNode, notSupportedErrorFactory, sampleRate }) {
        super({
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fakeNodeStore,
            numberOfInputs: 1,
            numberOfOutputs: 1
        });

        this._feedback = feedback;
        this._feedforward = feedforward;
        this._nativeNode = nativeNode;
            this._notSupportedErrorFactory = notSupportedErrorFactory;
        this._nyquist = sampleRate / 2;
    }

    public getFrequencyResponse (frequencyHz, magResponse, phaseResponse) {
        // Bug #9: Safari does not support IIRFilterNodes.
        if (this._nativeNode) {
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

export class OfflineIIRFilterNodeFaker {

    private _feedback;

    private _feedforward;

    private _invalidStateErrorFactory;

    private _length;

    private _nativeNode;

    private _node;

    private _notSupportedErrorFactory;

    private _numberOfChannels;

    private _promiseSupportTester;

    private _proxy;

    private _sources;

    private _UnpatchedOfflineAudioContext;

    constructor ({
        fakeNodeStore,
        feedback,
        feedforward,
        invalidStateErrorFactory,
        length,
        nativeNode,
        notSupportedErrorFactory,
        numberOfChannels,
        promiseSupportTester,
        sampleRate,
        UnpatchedOfflineAudioContext // tslint:disable-line:variable-name
    }) {
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
            sampleRate
        });
        this._sources = new Map();
        this._UnpatchedOfflineAudioContext = UnpatchedOfflineAudioContext;

        fakeNodeStore.set(this._proxy, this);
    }

    public get proxy () {
        return this._proxy;
    }

    private _applyFilter (renderedBuffer, offlineAudioContext) {
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

    public render (offlineAudioContext) {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        const promises = [];

        // Bug #9: Safari does not support IIRFilterNodes.
        if (this._nativeNode) {
            this._node = offlineAudioContext.createIIRFilter(this._feedforward, this._feedback);

            for (const [ source, { input, output } ] of this._sources) {
                promises.push(source
                    .render(offlineAudioContext)
                    .then((node) => node.connect(this._node, output, input)));
            }

            return Promise
                .all(promises)
                .then(() => this._node);
        }

        // @todo Somehow retrieve the number of channels.
        const partialOfflineAudioContext = new this._UnpatchedOfflineAudioContext(
            this._numberOfChannels,
            this._length,
            offlineAudioContext.sampleRate
        );

        for (const [ source, { input, output } ] of this._sources) {
            promises.push(source
                .render(partialOfflineAudioContext)
                .then((node) => node.connect(partialOfflineAudioContext.destination, output, input)));
        }

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
                this._node = offlineAudioContext.createBufferSource();
                this._node.buffer = this._applyFilter(renderedBuffer, offlineAudioContext);
                this._node.start(0);

                return this._node;
            });
    }

    public wire (source, output, input) {
        this._sources.set(source, { input, output });

        return this._proxy;
    }

    public unwire (source) {
        this._sources.delete(source);
    }

}

@Injectable()
export class OfflineIIRFilterNodeFakerFactory {

    constructor (
        @Inject(unpatchedOfflineAudioContextConstructor) private _UnpatchedOfflineAudioContext,
        @Inject(InvalidStateErrorFactory) private _invalidStateErrorFactory,
        @Inject(NotSupportedErrorFactory) private _notSupportedErrorFactory,
        @Inject(PromiseSupportTester) private _promiseSupportTester
    ) { }

    public create ({ fakeNodeStore, feedback, feedforward, length, nativeNode, numberOfChannels, sampleRate }) {
        return new OfflineIIRFilterNodeFaker({
            UnpatchedOfflineAudioContext: this._UnpatchedOfflineAudioContext,
            fakeNodeStore,
            feedback,
            feedforward,
            invalidStateErrorFactory: this._invalidStateErrorFactory,
            length,
            nativeNode,
            notSupportedErrorFactory: this._notSupportedErrorFactory,
            numberOfChannels,
            promiseSupportTester: this._promiseSupportTester,
            sampleRate
        });
    }

}
