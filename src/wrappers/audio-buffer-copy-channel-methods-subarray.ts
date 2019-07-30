import { createIndexSizeError } from '../factories/index-size-error';
import { TNativeAudioBuffer } from '../types';

export const wrapAudioBufferCopyChannelMethodsSubarray = (audioBuffer: TNativeAudioBuffer): void => {
    audioBuffer.copyFromChannel = ((copyFromChannel) => {
        return (destination: Float32Array, channelNumber: number, bufferOffset = 0) => {
            if (channelNumber >= audioBuffer.numberOfChannels) {
                throw createIndexSizeError();
            }

            if (bufferOffset < audioBuffer.length && audioBuffer.length - bufferOffset < destination.length) {
                return copyFromChannel.call(
                    audioBuffer, destination.subarray(0, audioBuffer.length - bufferOffset), channelNumber, bufferOffset
                );
            }

            return copyFromChannel.call(audioBuffer, destination, channelNumber, bufferOffset);
        };
    })(audioBuffer.copyFromChannel);

    audioBuffer.copyToChannel = ((copyToChannel) => {
        return (source: Float32Array, channelNumber: number, bufferOffset = 0) => {
            if (channelNumber >= audioBuffer.numberOfChannels) {
                throw createIndexSizeError();
            }

            if (bufferOffset < audioBuffer.length && audioBuffer.length - bufferOffset < source.length) {
                return copyToChannel.call(
                    audioBuffer, source.subarray(0, audioBuffer.length - bufferOffset), channelNumber, bufferOffset
                );
            }

            return copyToChannel.call(audioBuffer, source, channelNumber, bufferOffset);
        };
    })(audioBuffer.copyToChannel);
};
