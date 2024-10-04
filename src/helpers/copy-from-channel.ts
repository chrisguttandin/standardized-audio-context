import { TNativeAudioBuffer } from '../types';

export function copyFromChannel(
    audioBuffer: TNativeAudioBuffer,
    parent: { [key: number]: Float32Array },
    key: number,
    channelNumber: number,
    bufferOffset: number
): void;
export function copyFromChannel(
    audioBuffer: TNativeAudioBuffer,
    parent: { [key: string]: Float32Array },
    key: string,
    channelNumber: number,
    bufferOffset: number
): void;
export function copyFromChannel(
    audioBuffer: TNativeAudioBuffer,
    // @todo There is currently no way to define something like { [ key: number | string ]: Float32Array }
    parent: any,
    key: number | string,
    channelNumber: number,
    bufferOffset: number
): void {
    // The byteLength will be 0 when the ArrayBuffer was transferred.
    if (parent[key].byteLength === 0) {
        parent[key] = new Float32Array(128);
    }

    audioBuffer.copyFromChannel(parent[key], channelNumber, bufferOffset);
}
