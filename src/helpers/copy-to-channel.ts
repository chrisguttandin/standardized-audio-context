import { TNativeAudioBuffer } from '../types';

export const copyToChannel = (
    audioBuffer: TNativeAudioBuffer,
    parent: { [key: number]: Float32Array },
    key: number,
    channelNumber: number,
    bufferOffset: number
): void => {
    // The byteLength will be 0 when the ArrayBuffer was transferred.
    if (parent[key].byteLength !== 0) {
        audioBuffer.copyToChannel(parent[key], channelNumber, bufferOffset);
    }
};
