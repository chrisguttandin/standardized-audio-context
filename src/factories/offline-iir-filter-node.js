import { Inject } from '@angular/core/src/di/decorators';
import { InvalidStateErrorFactory } from './invalid-state-error';
import { NotSupportedErrorFactory } from './not-supported-error';
import { OfflineAudioNodeProxy } from '../offline-audio-node';

function divide (a, b) {
    var denominator = (b[0] * b[0]) + (b[1] * b[1]);

    return [ (((a[0] * b[0]) + (a[1] * b[1])) / denominator), (((a[1] * b[0]) - (a[0] * b[1])) / denominator) ];
}

function multiply (a, b) {
    return [ ((a[0] * b[0]) - (a[1] * b[1])), ((a[0] * b[1]) + (a[1] * b[0])) ];
}

function evaluatePolynomial (coefficient, z) {
    var result = [ 0, 0 ];

    for (let i = coefficient.length - 1; i >= 0; i -= 1) {
        result = multiply(result, z);

        result[0] += coefficient[i];
    }

    return result;
}

class OfflineIIRFilterNodeProxy extends OfflineAudioNodeProxy {

    constructor ({ fakeNodeStore, feedback, feedforward, notSupportedErrorFactory, sampleRate }) {
        super({
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fakeNodeStore,
            numberOfInputs: 1,
            numberOfOutputs: 1
        });

        this._feedback = feedback;
        this._feedforward = feedforward;
        this._notSupportedErrorFactory = notSupportedErrorFactory;
        this._nyquist = sampleRate / 2;
    }

    getFrequencyResponse (frequencyHz, magResponse, phaseResponse) {
        if (magResponse.length === 0 || phaseResponse.length === 0) {
            throw this._notSupportedErrorFactory.create();
        }

        for (let i = 0, length = frequencyHz.length; i < length; i += 1) {
            let denominator,
                numerator,
                omega,
                response,
                z;

            omega = -Math.PI * (frequencyHz[i] / this._nyquist);
            z = [ Math.cos(omega), Math.sin(omega) ];
            numerator = evaluatePolynomial(this._feedforward, z);
            denominator = evaluatePolynomial(this._feedback, z);
            response = divide(numerator, denominator);

            magResponse[i] = Math.sqrt((response[0] * response[0]) + (response[1] * response[1]));
            phaseResponse[i] = Math.atan2(response[1], response[0]);
        }
    };

}

class OfflineIIRFilterNodeFaker {

    constructor ({ fakeNodeStore, feedback, feedforward, invalidStateErrorFactory, length, notSupportedErrorFactory, sampleRate }) {
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
        this._length = length;
        this._node = null;
        this._proxy = new OfflineIIRFilterNodeProxy({ fakeNodeStore, feedback, feedforward, notSupportedErrorFactory, sampleRate });
        this._sampleRate = sampleRate;
        this._sources = new Map();

        fakeNodeStore.set(this._proxy, this);
    }

    get proxy () {
        return this._proxy;
    }

    _applyFilter (renderedBuffer, offlineAudioContext) {
        var bufferIndex = 0,
            bufferLength = 32,
            feedback = this._feedback,
            feedbackLength = this._feedback.length,
            feedforward = this._feedforward,
            feedforwardLength = this._feedforward.length,
            filteredBuffer,
            minLength,
            xBuffer,
            yBuffer;

        if (feedforward.length === 0 || feedforward.length > 20 || feedback.length === 0 || feedback.length > 20) {
            throw this._notSupportedErrorFactory.create();
        }

        if (feedforward[0] === 0 || feedback[0] === 0) {
            throw this._invalidStateErrorFactory.create();
        }

        if (feedback[0] !== 1) {
            for (let i = 0, length = feedforward.length; i < length; i += 1) {
                feedforward[i] /= feedback[0];
            }

            for (let i = 1, length = feedback.length; i < length; i += 1) {
                feedback[i] /= feedback[0];
            }
        }

        xBuffer = new Float32Array(bufferLength);
        yBuffer = new Float32Array(bufferLength);

        minLength = Math.min(feedbackLength, feedforwardLength);

        // @todo Use TypedArray.prototype.fill() once it lands in Safari.
        for (let i = 0; i < bufferLength; i += 1) {
            xBuffer[i] = 0;
            yBuffer[i] = 0;
        }

        filteredBuffer = offlineAudioContext.createBuffer(
            renderedBuffer.numberOfChannels,
            renderedBuffer.length,
            renderedBuffer.sampleRate
        );

        // This implementation as shamelessly inspired by source code of
        // {@link https://chromium.googlesource.com/chromium/src.git/+/master/third_party/WebKit/Source/platform/audio/IIRFilter.cpp|Chromium's IIRFilter}.
        for (let i = 0, numberOfChannels = renderedBuffer.numberOfChannels; i < numberOfChannels; i += 1) {
            let input = renderedBuffer.getChannelData(i),
                output = filteredBuffer.getChannelData(i);

            for (let inputLength = input.length, j = 0; j < inputLength; j += 1) {
                let y = feedforward[0] * input[j];

                for (let k = 1; k < minLength; k += 1) {
                    let x = (bufferIndex - k) & (bufferLength - 1); // eslint-disable-line no-bitwise

                    y += feedforward[k] * xBuffer[x];
                    y -= feedback[k] * yBuffer[x];
                }

                for (let k = minLength; k < feedforwardLength; k += 1) {
                    y += feedforward[k] * xBuffer[(bufferIndex - k) & (bufferLength - 1)]; // eslint-disable-line no-bitwise
                }

                for (let k = minLength; k < feedbackLength; k += 1) {
                    y -= feedback[k] * yBuffer[(bufferIndex - k) & (bufferLength - 1)]; // eslint-disable-line no-bitwise
                }

                xBuffer[bufferIndex] = input[j];
                yBuffer[bufferIndex] = y;

                bufferIndex = (bufferIndex + 1) & (bufferLength - 1); // eslint-disable-line no-bitwise

                output[j] = y;
            }
        }

        return filteredBuffer;
    }

    render (offlineAudioContext) {
        var partialOfflineAudioContext,
            promises;

        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        partialOfflineAudioContext = ('OfflineAudioContext' in window) ? // eslint-disable-line no-undef
            // @todo Somehow retrieve the number of channels.
            new OfflineAudioContext(2, this._length, this._sampleRate) : // eslint-disable-line no-undef
            new webkitOfflineAudioContext(2, this._length, this._sampleRate); // eslint-disable-line new-cap, no-undef
        promises = [];

        for (let [ source, { input, output }] of this._sources) {
            promises.push(source
                .render(partialOfflineAudioContext)
                .then((node) => node.connect(partialOfflineAudioContext.destination, output, input)));
        }

        return Promise
            .all(promises)
            // @todo Do not patch startRendering() if it already returns a promise.
            .then(() => new Promise((resolve) => {
                partialOfflineAudioContext.oncomplete = (event) => resolve(event.renderedBuffer);

                partialOfflineAudioContext.startRendering();
            }))
            .then((renderedBuffer) => {
                this._node = offlineAudioContext.createBufferSource();
                this._node.buffer = this._applyFilter(renderedBuffer, offlineAudioContext);
                this._node.start(0);

                return this._node;
            });
    }

    wire (source, output, input) {
        this._sources.set(source, { input, output });

        return this._proxy;
    }

    unwire (source) {
        this._sources.delete(source);
    }

}

export class OfflineIIRFilterNodeFakerFactory {

    constructor (invalidStateErrorFactory, notSupportedErrorFactory) {
        this._invalidStateErrorFactory = invalidStateErrorFactory;
        this._notSupportedErrorFactory = notSupportedErrorFactory;
    }

    create ({ fakeNodeStore, feedforward, feedback, length, sampleRate }) {
        return new OfflineIIRFilterNodeFaker({
            fakeNodeStore,
            feedforward,
            feedback,
            invalidStateErrorFactory: this._invalidStateErrorFactory,
            length,
            notSupportedErrorFactory: this._notSupportedErrorFactory,
            sampleRate
        });
    }

}

OfflineIIRFilterNodeFakerFactory.parameters = [ [ new Inject(InvalidStateErrorFactory) ], [ new Inject(NotSupportedErrorFactory) ] ];
