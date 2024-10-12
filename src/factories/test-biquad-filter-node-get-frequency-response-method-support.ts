import { TNativeOfflineAudioContextConstructor } from '../types';

/*
 * Bug #189: Safari up to version 14.1 threw an InvalidStateError when calling getFrequencyResponse() on a BiquadFilterNode with an empty
 * Float32Array as the frequencyHz parameter. It also had a couple more bugs but since this is easy to test it's used here as a placeholder.
 *
 * Bug #61: Safari up to version 14.1 had no AudioWorkletNode implementation.
 *
 * Bug #176: Safari up to version 14.1 rejected the promise returned by addModule() with an AbortError if the source code contained an
 * import statement.
 *
 * Bug #190: Safari up to version 14.1 threw no error when trying to add an unparsable AudioWorklet module.
 *
 * Bug #192: Safari up to version 14.1 threw a SyntaxError instead of a NotSupportedError when creating an AudioContext with an unsupported
 * sampleRate.
 *
 * Bug #201: Safari up to version 14.1 only allowed to use a MediaStream for a single MediaStreamAudioSourceNode. In any further usage of
 * the same MediaStream resulted in silence.
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
