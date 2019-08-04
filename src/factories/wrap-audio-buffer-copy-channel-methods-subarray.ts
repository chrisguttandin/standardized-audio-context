import { TNativeAudioBuffer, TWrapAudioBufferCopyChannelMethodsSubarrayFactory } from '../types';

export const createWrapAudioBufferCopyChannelMethodsSubarray: TWrapAudioBufferCopyChannelMethodsSubarrayFactory = (
    convertNumberToUnsignedLong,
    createIndexSizeError
) => {
    return (audioBuffer: TNativeAudioBuffer): void => {
        audioBuffer.copyFromChannel = ((copyFromChannel) => {
            return (destination: Float32Array, channelNumberAsNumber: number, bufferOffsetAsNumber = 0) => {
                const bufferOffset = convertNumberToUnsignedLong(bufferOffsetAsNumber);
                const channelNumber = convertNumberToUnsignedLong(channelNumberAsNumber);

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
            return (source: Float32Array, channelNumberAsNumber: number, bufferOffsetAsNumber = 0) => {
                const bufferOffset = convertNumberToUnsignedLong(bufferOffsetAsNumber);
                const channelNumber = convertNumberToUnsignedLong(channelNumberAsNumber);

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
};
