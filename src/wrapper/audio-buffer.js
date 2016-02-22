export class AudioBufferWrapper {

    wrap (audioBuffer) {
        // @todo throw errors
        audioBuffer.copyFromChannel = function (destination, channelNumber, startInChannel) {
            var channelData,
                channelLength,
                destinationLength,
                i;

            if (arguments.length < 3) {
                startInChannel = 0;
            }

            channelData = audioBuffer.getChannelData(channelNumber);
            channelLength = channelData.length;
            destinationLength = destination.length;

            for (i = 0; i + startInChannel < channelLength && i < destinationLength; i += 1) {
                destination[i] = channelData[i + startInChannel];
            }
        };

        audioBuffer.copyToChannel = function (source, channelNumber, startInChannel) {
            var channelData,
                channelLength,
                i,
                sourceLength;

            if (arguments.length < 3) {
                startInChannel = 0;
            }

            channelData = audioBuffer.getChannelData(channelNumber);
            channelLength = channelData.length;
            sourceLength = source.length;

            for (i = 0; i + startInChannel < channelLength && i < sourceLength; i += 1) {
                channelData[i + startInChannel] = source[i];
            }
        };

        return audioBuffer;
    }

}
