import { TNativeOfflineAudioContextConstructor } from '../types';

/*
 * Bug #98: Firefox up to version 133 not treated the value setter like a call to setValueAtTime().
 */
export const createTestAudioParamValueSetterSupport =
    (nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor) => () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return Promise.resolve(false);
        }

        const offlineAudioContext = new nativeOfflineAudioContextConstructor(1, 44100, 44100);
        const constantSourceNode = offlineAudioContext.createConstantSource();
        const gainNode = offlineAudioContext.createGain();

        gainNode.gain.setValueAtTime(-1, 0);
        gainNode.gain.linearRampToValueAtTime(1, 1);

        gainNode.gain.value = 100;

        constantSourceNode.connect(gainNode).connect(offlineAudioContext.destination);
        constantSourceNode.start();

        return offlineAudioContext.startRendering().then((renderedBuffer) => {
            const channelData = new Float32Array(0.5 * offlineAudioContext.sampleRate);

            renderedBuffer.copyFromChannel(channelData, 0);

            for (const sample of channelData) {
                if (sample > 1) {
                    return true;
                }
            }

            return false;
        });
    };
