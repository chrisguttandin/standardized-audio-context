import { TNativeAudioBuffer } from '../types';

export const wrapAudioBufferCopyChannelMethodsSubarray = (audioBuffer: TNativeAudioBuffer): void => {
    audioBuffer.copyFromChannel = ((copyFromChannel) => {
        return (destination: Float32Array, channelNumber: number, startInChannel = 0) => {
            if (startInChannel < audioBuffer.length && audioBuffer.length - startInChannel < destination.length) {
                return copyFromChannel.call(
                    audioBuffer, destination.subarray(0, audioBuffer.length - startInChannel), channelNumber, startInChannel
                );
            }

            return copyFromChannel.call(audioBuffer, destination, channelNumber, startInChannel);
        };
    })(audioBuffer.copyFromChannel);

    audioBuffer.copyToChannel = ((copyToChannel) => {
        return (source: Float32Array, channelNumber: number, startInChannel = 0) => {
            if (startInChannel < audioBuffer.length && audioBuffer.length - startInChannel < source.length) {
                return copyToChannel.call(
                    audioBuffer, source.subarray(0, audioBuffer.length - startInChannel), channelNumber, startInChannel
                );
            }

            return copyToChannel.call(audioBuffer, source, channelNumber, startInChannel);
        };
    })(audioBuffer.copyToChannel);
};
