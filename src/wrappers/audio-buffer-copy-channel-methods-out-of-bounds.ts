import { TNativeAudioBuffer } from '../types';

export const wrapAudioBufferCopyChannelMethodsOutOfBounds = (audioBuffer: TNativeAudioBuffer): void => {
    audioBuffer.copyFromChannel = ((copyFromChannel) => {
        return (destination: Float32Array, channelNumber: number, bufferOffset = 0) => {
            if (bufferOffset < 0) {
                if (bufferOffset + destination.length > 0) {
                    return copyFromChannel.call(audioBuffer, destination.subarray(-bufferOffset), channelNumber, 0);
                }
            } else if (bufferOffset < audioBuffer.length) {
                return copyFromChannel.call(audioBuffer, destination, channelNumber, bufferOffset);
            }
        };
    })(audioBuffer.copyFromChannel);

    audioBuffer.copyToChannel = ((copyToChannel) => {
        return (source: Float32Array, channelNumber: number, bufferOffset = 0) => {
            if (bufferOffset < 0) {
                if (bufferOffset + source.length > 0) {
                    return copyToChannel.call(audioBuffer, source.subarray(-bufferOffset), channelNumber, 0);
                }
            } else if (bufferOffset < audioBuffer.length) {
                return copyToChannel.call(audioBuffer, source, channelNumber, bufferOffset);
            }
        };
    })(audioBuffer.copyToChannel);
};
