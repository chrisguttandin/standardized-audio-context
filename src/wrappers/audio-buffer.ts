import { Injectable } from '@angular/core';

@Injectable()
export class AudioBufferWrapper {

    public wrap (audioBuffer) {
        // @todo throw errors
        audioBuffer.copyFromChannel = (destination, channelNumber, startInChannel = 0) => {
            const channelData = audioBuffer.getChannelData(channelNumber);

            const channelLength = channelData.length;

            const destinationLength = destination.length;

            for (let i = 0; i + startInChannel < channelLength && i < destinationLength; i += 1) {
                destination[i] = channelData[i + startInChannel];
            }
        };

        audioBuffer.copyToChannel = (source, channelNumber, startInChannel = 0) => {
            const channelData = audioBuffer.getChannelData(channelNumber);

            const channelLength = channelData.length;

            const sourceLength = source.length;

            for (let i = 0; i + startInChannel < channelLength && i < sourceLength; i += 1) {
                channelData[i + startInChannel] = source[i];
            }
        };

        return audioBuffer;
    }

}
