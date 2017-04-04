import { Inject, Injectable } from '@angular/core';
import { InvalidAccessErrorFactory } from '../factories/invalid-access-error';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { NotSupportedErrorFactory } from '../factories/not-supported-error';

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

@Injectable()
export class IIRFilterNodeFaker {

    constructor (
        @Inject(InvalidAccessErrorFactory) private _invalidAccessErrorFactory,
        @Inject(InvalidStateErrorFactory) private _invalidStateErrorFactory,
        @Inject(NotSupportedErrorFactory) private _notSupportedErrorFactory
    ) { }

    public fake (feedforward, feedback, audioContext, unpatchedAudioContext) {
        let bufferIndex = 0;

        const bufferLength = 32;

        const feedbackLength = feedback.length;

        const feedforwardLength = feedforward.length;

        if (feedforward.length === 0 || feedforward.length > 20 || feedback.length === 0 || feedback.length > 20) {
            throw this._notSupportedErrorFactory.create();
        }

        if (feedforward[0] === 0 || feedback[0] === 0) {
            throw this._invalidStateErrorFactory.create();
        }

        if (feedback[0] !== 1) {
            for (let i = 0; i < feedforwardLength; i += 1) {
                feedforward[i] /= feedback[0];
            }

            for (let i = 1; i < feedbackLength; i += 1) {
                feedback[i] /= feedback[0];
            }
        }

        const gainNode = audioContext.createGain();
        const nyquist = audioContext.sampleRate / 2;
        // @todo Remove this once the audioContext supports the createScriptProcessor() method, too.
        const scriptProcessorNode = unpatchedAudioContext.createScriptProcessor(256, gainNode.channelCount, gainNode.channelCount);

        const bufferSize = scriptProcessorNode.bufferSize;

        const xBuffer = new Float32Array(bufferLength);
        const yBuffer = new Float32Array(bufferLength);

        const minLength = Math.min(feedbackLength, feedforwardLength);

        // @todo Use TypedArray.prototype.fill() once it lands in Safari.
        for (let i = 0; i < bufferLength; i += 1) {
            xBuffer[i] = 0;
            yBuffer[i] = 0;
        }

        // This implementation as shamelessly inspired by source code of
        // tslint:disable-next-line:max-line-length
        // {@link https://chromium.googlesource.com/chromium/src.git/+/master/third_party/WebKit/Source/platform/audio/IIRFilter.cpp|Chromium's IIRFilter}.
        scriptProcessorNode.onaudioprocess = (event) => {
            const inputBuffer = event.inputBuffer;

            const outputBuffer = event.outputBuffer;

            const numberOfChannels = inputBuffer.numberOfChannels;

            for (let i = 0; i < numberOfChannels; i += 1) {
                const input = inputBuffer.getChannelData(i);
                const output = outputBuffer.getChannelData(i);

                for (let j = 0; j < bufferSize; j += 1) {
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
        };

        gainNode.getFrequencyResponse = (frequencyHz, magResponse, phaseResponse) => {
            if (magResponse.length === 0 || phaseResponse.length === 0) {
                throw this._notSupportedErrorFactory.create();
            }

            const length = frequencyHz.length;

            for (let i = 0; i < length; i += 1) {
                const omega = -Math.PI * (frequencyHz[i] / nyquist);

                const z = [ Math.cos(omega), Math.sin(omega) ];

                const numerator = evaluatePolynomial(feedforward, z);

                const denominator = evaluatePolynomial(feedback, z);

                const response = divide(numerator, denominator);

                magResponse[i] = Math.sqrt((response[0] * response[0]) + (response[1] * response[1]));
                phaseResponse[i] = Math.atan2(response[1], response[0]);
            }
        };

        gainNode.connect(scriptProcessorNode);

        gainNode.connect = (destination, output = 0, input = 0) => {
            console.log('HEY');
            try {
                scriptProcessorNode.connect.call(scriptProcessorNode, destination, output, input);
            } catch (err) {
                console.log(err, err.code);

                if (err.code === 12) {
                    throw this._invalidAccessErrorFactory.create();
                }

                throw err;
            }

            return destination;
        };

        return gainNode;
    }

}
