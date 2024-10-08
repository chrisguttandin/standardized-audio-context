import { TNativeOfflineAudioContextConstructor } from '../types';

/*
 * Bug #189: Safari up to version 14.1 threw an InvalidStateError when calling getFrequencyResponse() on a BiquadFilterNode with an empty
 * Float32Array as the frequencyHz parameter.
 */
export const createTestBiquadFilterNodeGetFrequencyResponseMethodSupport = (
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);
        const nativeBiquadFilterNode = nativeOfflineAudioContext.createBiquadFilter();

        try {
            nativeBiquadFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
        } catch (err) {
            return err.code === 15;
        }

        return false;
    };
};
