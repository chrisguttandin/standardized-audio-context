import { TTestConvolverNodeBufferReassignabilitySupportFactory } from '../types';

// Opera up to version 57 did not allow to reassign the buffer of a ConvolverNode.
export const createTestConvolverNodeBufferReassignabilitySupport: TTestConvolverNodeBufferReassignabilitySupportFactory = (
    nativeOfflineAudioContextConstructor
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const offlineAudioContext = new nativeOfflineAudioContextConstructor(1, 128, 3200);
        const nativeConvolverNode = offlineAudioContext.createConvolver();

        nativeConvolverNode.buffer = offlineAudioContext.createBuffer(1, 1, offlineAudioContext.sampleRate);

        try {
            nativeConvolverNode.buffer = offlineAudioContext.createBuffer(1, 1, offlineAudioContext.sampleRate);
        } catch {
            return false;
        }

        return true;
    };
};
