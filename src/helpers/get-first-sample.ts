import { TGetFirstSampleFunction } from '../types';

export const getFirstSample: TGetFirstSampleFunction = (audioBuffer, buffer, channelNumber) => {
    audioBuffer.copyFromChannel(buffer, channelNumber);

    return buffer[0];
};
