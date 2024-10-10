import { TNativeOfflineAudioContextConstructor } from '../types';

// Bug #72: Firefox up to version 73 allowed to reassign the buffer of an AudioBufferSourceNode.
export const createTestAudioBufferSourceNodeBufferReassignmentSupport = (
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);
        const nativeAudioBufferSourceNode = nativeOfflineAudioContext.createBufferSource();

        nativeAudioBufferSourceNode.buffer = nativeOfflineAudioContext.createBuffer(1, 1, 44100);

        try {
            nativeAudioBufferSourceNode.buffer = nativeOfflineAudioContext.createBuffer(1, 1, 44100);
        } catch (err) {
            return err.code === 11;
        }

        return false;
    };
};
