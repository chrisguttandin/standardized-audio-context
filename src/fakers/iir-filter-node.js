import { Inject } from '@angular/core/src/di/decorators';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { NotSupportedErrorFactory } from '../factories/not-supported-error';

function divide (a, b) {
    var denominator = b[0] * b[0] + b[1] * b[1];

    return [ ((a[0] * b[0] + a[1] * b[1]) / denominator), ((a[1] * b[0] - a[0] * b[1]) / denominator) ];
}

function multiply (a, b) {
    return [ (a[0] * b[0] - a[1] * b[1]), (a[0] * b[1] + a[1] * b[0]) ];
}

function evaluatePolynomial (coefficient, z) {
    var result = [ 0, 0 ];

    for (let i = coefficient.length - 1; i >= 0; i -= 1) {
        result = multiply(result, z);

        result[0] += coefficient[i];
    }

    return result;
}

export class IIRFilterNodeFaker {

    constructor (invalidStateErrorFactory, notSupportedErrorFactory) {
        this._invalidStateErrorFactory = invalidStateErrorFactory;
        this._notSupportedErrorFactory = notSupportedErrorFactory;
    }

    fake (feedforward, feedback, audioContext, unpatchedAudioContext) {
        var bufferIndex = 0,
            bufferLength = 32,
            bufferSize,
            feedbackLength = feedback.length,
            feedforwardLength = feedforward.length,
            gainNode,
            minLength,
            nyquist,
            scriptProcessorNode,
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

        gainNode = audioContext.createGain();
        nyquist = audioContext.sampleRate / 2;
        // @todo Remove this once the audioContext supports the createScriptProcessor() method, too.
        scriptProcessorNode = unpatchedAudioContext.createScriptProcessor(256, gainNode.channelCount, gainNode.channelCount);
        bufferSize = scriptProcessorNode.bufferSize;

        xBuffer = new Float32Array(bufferLength);
        yBuffer = new Float32Array(bufferLength);

        minLength = Math.min(feedbackLength, feedforwardLength);

        // @todo Use TypedArray.prototype.fill() once it lands in Safari.
        for (let i = 0; i < bufferLength; i += 1) {
            xBuffer[i] = 0;
            yBuffer[i] = 0;
        }

        // This implementation as shamelessly inspired by source code of
        // {@link https://chromium.googlesource.com/chromium/src.git/+/master/third_party/WebKit/Source/platform/audio/IIRFilter.cpp|Chromium's IIRFilter}.
        scriptProcessorNode.onaudioprocess = function (event) {
            var inputBuffer = event.inputBuffer,
                outputBuffer = event.outputBuffer;

            for (let i = 0, numberOfChannels = inputBuffer.numberOfChannels; i < numberOfChannels; i += 1) {
                let input = inputBuffer.getChannelData(i),
                    output = outputBuffer.getChannelData(i);

                for (let j = 0; j < bufferSize; j += 1) {
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
        };

        gainNode.getFrequencyResponse = (frequencyHz, magResponse, phaseResponse) => {
            if (magResponse.length === 0 || phaseResponse.length === 0) {
                throw this._notSupportedErrorFactory.create();
            }

            for (let i = 0, length = frequencyHz.length; i < length; i += 1) {
                let denominator,
                    numerator,
                    omega,
                    response,
                    z;

                omega = -Math.PI * (frequencyHz[i] / nyquist);
                z = [ Math.cos(omega), Math.sin(omega) ];
                numerator = evaluatePolynomial(feedforward, z);
                denominator = evaluatePolynomial(feedback, z);
                response = divide(numerator, denominator);

                magResponse[i] = Math.sqrt(response[0] * response[0] + response[1] * response[1]);
                phaseResponse[i] = Math.atan2(response[1], response[0]);
            }
        };

        gainNode.connect(scriptProcessorNode);

        gainNode.connect = function (destination) {
            // @todo Directly return the scriptProcessorNodeNode once it supports chaining.
            scriptProcessorNode.connect.apply(scriptProcessorNode, arguments);

            // @todo Test this expectation.
            // Only Chrome and Firefox support chaining in their dev versions yet.
            return destination;
        };

        return gainNode;
    }

}

IIRFilterNodeFaker.parameters = [ [ new Inject(InvalidStateErrorFactory) ], [ new Inject(NotSupportedErrorFactory) ] ];
