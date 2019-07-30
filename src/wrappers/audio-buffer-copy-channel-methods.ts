import { createIndexSizeError } from '../factories/index-size-error';
import { TNativeAudioBuffer } from '../types';

export const wrapAudioBufferCopyChannelMethods = (audioBuffer: TNativeAudioBuffer): void => {
    audioBuffer.copyFromChannel = (destination, channelNumber, bufferOffset = 0) => {
        if (channelNumber >= audioBuffer.numberOfChannels) {
            throw createIndexSizeError();
        }

        const audioBufferLength = audioBuffer.length;
        const channelData = audioBuffer.getChannelData(channelNumber);
        const destinationLength = destination.length;

        for (let i = (bufferOffset < 0) ? -bufferOffset : 0; i + bufferOffset < audioBufferLength && i < destinationLength; i += 1) {
            destination[i] = channelData[i + bufferOffset];
        }
    };

    audioBuffer.copyToChannel = (source, channelNumber, bufferOffset = 0) => {
        if (channelNumber >= audioBuffer.numberOfChannels) {
            throw createIndexSizeError();
        }

        const audioBufferLength = audioBuffer.length;
        const channelData = audioBuffer.getChannelData(channelNumber);
        const sourceLength = source.length;

        for (let i = (bufferOffset < 0) ? -bufferOffset : 0; i + bufferOffset < audioBufferLength && i < sourceLength; i += 1) {
            channelData[i + bufferOffset] = source[i];
        }
    };
};
