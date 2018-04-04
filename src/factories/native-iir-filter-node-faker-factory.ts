import { filterBuffer } from '../helpers/filter-buffer';
import { TNativeIIRFilterNodeFakerFactoryFactory, TTypedArray } from '../types';

function divide (a: [ number, number ], b: [ number, number ]): [ number, number ] {
    const denominator = (b[0] * b[0]) + (b[1] * b[1]);

    return [ (((a[0] * b[0]) + (a[1] * b[1])) / denominator), (((a[1] * b[0]) - (a[0] * b[1])) / denominator) ];
}

function multiply (a: [ number, number ], b: [ number, number ]): [ number, number ] {
    return [ ((a[0] * b[0]) - (a[1] * b[1])), ((a[0] * b[1]) + (a[1] * b[0])) ];
}

function evaluatePolynomial (coefficient: number[] | TTypedArray, z: [ number, number ]) {
    let result: [ number, number ] = [ 0, 0 ];

    for (let i = coefficient.length - 1; i >= 0; i -= 1) {
        result = multiply(result, z);

        result[0] += coefficient[i];
    }

    return result;
}

export const createNativeIIRFilterNodeFakerFactory: TNativeIIRFilterNodeFakerFactoryFactory = (
    createInvalidAccessError,
    createInvalidStateError,
    createNotSupportedError
) => {
    return (nativeAudioContext, { channelCount, channelCountMode, channelInterpretation, feedback, feedforward }) => {
        const bufferSize = 256;
        const feedbackLength = feedback.length;
        const feedforwardLength = feedforward.length;
        const minLength = Math.min(feedbackLength, feedforwardLength);

        if (feedback.length === 0 || feedback.length > 20) {
            throw createNotSupportedError();
        }

        if (feedback[0] === 0) {
            throw createInvalidStateError();
        }

        if (feedforward.length === 0 || feedforward.length > 20) {
            throw createNotSupportedError();
        }

        if (feedforward[0] === 0) {
            throw createInvalidStateError();
        }

        if (feedback[0] !== 1) {
            for (let i = 0; i < feedforwardLength; i += 1) {
                feedforward[i] /= feedback[0];
            }

            for (let i = 1; i < feedbackLength; i += 1) {
                feedback[i] /= feedback[0];
            }
        }

        const scriptProcessorNode = nativeAudioContext.createScriptProcessor(bufferSize, channelCount, channelCount);

        scriptProcessorNode.channelCount = channelCount;
        scriptProcessorNode.channelCountMode = channelCountMode;
        scriptProcessorNode.channelInterpretation = channelInterpretation;

        const bufferLength = 32;
        const bufferIndexes: number[] = [ ];
        const xBuffers: Float32Array[] = [ ];
        const yBuffers: Float32Array[] = [ ];

        for (let i = 0; i < channelCount; i += 1) {
            bufferIndexes.push(0);

            const xBuffer = new Float32Array(bufferLength);
            const yBuffer = new Float32Array(bufferLength);

            // @todo Add a test which checks support for TypedArray.prototype.fill().
            xBuffer.fill(0);
            yBuffer.fill(0);

            xBuffers.push(xBuffer);
            yBuffers.push(yBuffer);
        }

        scriptProcessorNode.onaudioprocess = (event: AudioProcessingEvent) => {
            const inputBuffer = event.inputBuffer;
            const outputBuffer = event.outputBuffer;

            const numberOfChannels = inputBuffer.numberOfChannels;

            for (let i = 0; i < numberOfChannels; i += 1) {
                const input = inputBuffer.getChannelData(i);
                const output = outputBuffer.getChannelData(i);

                bufferIndexes[i] = filterBuffer(
                    feedback,
                    feedbackLength,
                    feedforward,
                    feedforwardLength,
                    minLength,
                    xBuffers[i],
                    yBuffers[i],
                    bufferIndexes[i],
                    bufferLength,
                    input,
                    output
                );
            }
        };

        const nyquist = nativeAudioContext.sampleRate / 2;

        return {
            get bufferSize () {
                return bufferSize;
            },
            get channelCount () {
                return scriptProcessorNode.channelCount;
            },
            set channelCount (value) {
                scriptProcessorNode.channelCount = value;
            },
            get channelCountMode () {
                return scriptProcessorNode.channelCountMode;
            },
            set channelCountMode (value) {
                scriptProcessorNode.channelCountMode = value;
            },
            get channelInterpretation () {
                return scriptProcessorNode.channelInterpretation;
            },
            set channelInterpretation (value) {
                scriptProcessorNode.channelInterpretation = value;
            },
            get context () {
                return scriptProcessorNode.context;
            },
            get inputs () {
                return [ scriptProcessorNode ];
            },
            get numberOfInputs () {
                return scriptProcessorNode.numberOfInputs;
            },
            get numberOfOutputs () {
                return scriptProcessorNode.numberOfOutputs;
            },
            addEventListener (...args: any[]) {
                // @todo Dissallow adding an audioprocess listener.
                return scriptProcessorNode.addEventListener(args[0], args[1], args[2]);
            },
            connect (...args: any[]) {
                if (args[2] === undefined) {
                    return scriptProcessorNode.connect.call(scriptProcessorNode, args[0], args[1]);
                }

                return scriptProcessorNode.connect.call(scriptProcessorNode, args[0], args[1], args[2]);
            },
            disconnect (...args: any[]) {
                return scriptProcessorNode.disconnect.call(scriptProcessorNode, args[0], args[1], args[2]);
            },
            dispatchEvent (...args: any[]) {
                return scriptProcessorNode.dispatchEvent(args[0]);
            },
            getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) {
                if ((frequencyHz.length !== magResponse.length) || (magResponse.length !== phaseResponse.length)) {
                    throw createInvalidAccessError();
                }

                const length = frequencyHz.length;

                for (let i = 0; i < length; i += 1) {
                    const omega = -Math.PI * (frequencyHz[i] / nyquist);
                    const z: [ number, number ] = [ Math.cos(omega), Math.sin(omega) ];
                    const numerator = evaluatePolynomial(feedforward, z);
                    const denominator = evaluatePolynomial(feedback, z);
                    const response = divide(numerator, denominator);

                    magResponse[i] = Math.sqrt((response[0] * response[0]) + (response[1] * response[1]));
                    phaseResponse[i] = Math.atan2(response[1], response[0]);
                }
            },
            removeEventListener (...args: any[]) {
                return scriptProcessorNode.removeEventListener(args[0], args[1], args[2]);
            }
        };
    };
};
