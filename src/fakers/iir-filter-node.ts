import { Injectable } from '@angular/core';
import { filterBuffer } from '../helpers/filter-buffer';
import { TTypedArray, TUnpatchedAudioContext } from '../types';

@Injectable()
export class IIRFilterNodeFaker {

    public fake (
        unpatchedAudioContext: TUnpatchedAudioContext,
        feedback: number[] | TTypedArray,
        feedforward: number[] | TTypedArray,
        channelCount: number
    ) {
        const feedbackLength = feedback.length;
        const feedforwardLength = feedforward.length;
        const minLength = Math.min(feedbackLength, feedforwardLength);

        if (feedback[0] !== 1) {
            for (let i = 0; i < feedforwardLength; i += 1) {
                feedforward[i] /= feedback[0];
            }

            for (let i = 1; i < feedbackLength; i += 1) {
                feedback[i] /= feedback[0];
            }
        }

        const scriptProcessorNode = unpatchedAudioContext.createScriptProcessor(256, channelCount, channelCount);

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

        return scriptProcessorNode;
    }

}
