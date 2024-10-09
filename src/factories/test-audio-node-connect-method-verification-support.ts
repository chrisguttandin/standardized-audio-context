import { TNativeOfflineAudioContextConstructor } from '../types';

/*
 * Bug #58: Chrome up to version 92 threw no InvalidAccessError when connecting an AudioParam to an AudioNode belonging to a different
 * AudioContext.
 */
export const createTestAudioNodeConnectMethodVerificationSupport =
    (nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor) => () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const offlineAudioContextA = new nativeOfflineAudioContextConstructor(1, 1, 44100);
        const offlineAudioContextB = new nativeOfflineAudioContextConstructor(1, 1, 44100);

        try {
            offlineAudioContextA.createGain().connect(offlineAudioContextB.createGain().gain);
        } catch (err) {
            return err.code === 15;
        }

        return false;
    };
