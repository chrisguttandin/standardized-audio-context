import { TNativeAudioBuffer } from '../types';

export function copyFromChannel (
    audioBuffer: TNativeAudioBuffer,
    parent: { [ key: number ]: Float32Array },
    key: number,
    channelNumber: number,
    startInChannel: number
): void;
export function copyFromChannel (
    audioBuffer: TNativeAudioBuffer,
    parent: { [ key: string ]: Float32Array },
    key: string,
    channelNumber: number,
    startInChannel: number
): void;
export function copyFromChannel (
    audioBuffer: TNativeAudioBuffer,
    // @todo There is currently no way to define something like { [ key: number | string ]: Float32Array }
    parent: any,
    key: number | string,
    channelNumber: number,
    startInChannel: number
): void {
    if (typeof audioBuffer.copyFromChannel === 'function') {
        // The byteLength will be 0 when the ArrayBuffer was transferred.
        if (parent[key].byteLength === 0) {
            parent[key] = new Float32Array(128);
        }

        audioBuffer.copyFromChannel(parent[key], channelNumber, startInChannel);

    // Bug #5: Safari does not support copyFromChannel().
    } else {
        const channelData = audioBuffer.getChannelData(channelNumber);

        // The byteLength will be 0 when the ArrayBuffer was transferred.
        if (parent[key].byteLength === 0) {
            parent[key] = channelData.slice(startInChannel, startInChannel + 128);
        } else {
            const slicedInput = new Float32Array(channelData.buffer, startInChannel * Float32Array.BYTES_PER_ELEMENT, 128);

            parent[key].set(slicedInput);
        }
    }
}
