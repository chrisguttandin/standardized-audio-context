import { TWrapAudioBufferSourceNodeStopMethodNullifiedBufferFunction } from '../types';

export const wrapAudioBufferSourceNodeStopMethodNullifiedBuffer: TWrapAudioBufferSourceNodeStopMethodNullifiedBufferFunction = (
    nativeAudioBufferSourceNode,
    nativeContext
) => {
    const nullifiedBuffer = nativeContext.createBuffer(1, 1, nativeContext.sampleRate);

    if (nativeAudioBufferSourceNode.buffer === null) {
        nativeAudioBufferSourceNode.buffer = nullifiedBuffer;
    }

    const prototype = Object.getPrototypeOf(nativeAudioBufferSourceNode);
    const { get, set } = <Required<PropertyDescriptor>> Object.getOwnPropertyDescriptor(prototype, 'buffer');

    Object.defineProperty(nativeAudioBufferSourceNode, 'buffer', {
        get: () => {
            const value = get.call(nativeAudioBufferSourceNode);

            return (value === nullifiedBuffer) ? null : value;
        },
        set: (value) => {
            return set.call(nativeAudioBufferSourceNode, (value === null) ? nullifiedBuffer : value);
        }
    });
};
