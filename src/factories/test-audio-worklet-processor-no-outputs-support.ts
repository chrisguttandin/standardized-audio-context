import { TTestAudioWorkletProcessorNoOutputsSupportFactory } from '../types';

/**
 * Chrome version 66 and 67 did not call the process() function of an AudioWorkletProcessor if it had no outputs. AudioWorklet support was
 * enabled by default in version 66.
 */
export const createTestAudioWorkletProcessorNoOutputsSupport: TTestAudioWorkletProcessorNoOutputsSupportFactory = (
    nativeAudioWorkletNodeConstructor,
    nativeOfflineAudioContextConstructor
) => {
    return async () => {
        // Bug #61: If there is no native AudioWorkletNode it gets faked and therefore it is no problem if the it doesn't exist.
        if (nativeAudioWorkletNodeConstructor === null) {
            return true;
        }

        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const blob = new Blob(['class A extends AudioWorkletProcessor{process(){this.port.postMessage(0)}}registerProcessor("a",A)'], {
            type: 'application/javascript; charset=utf-8'
        });
        const offlineAudioContext = new nativeOfflineAudioContextConstructor(1, 128, 3200);
        const url = URL.createObjectURL(blob);

        let isCallingProcess = false;

        try {
            await offlineAudioContext.audioWorklet.addModule(url);
            const gainNode = offlineAudioContext.createGain();
            const audioWorkletNode = new nativeAudioWorkletNodeConstructor(offlineAudioContext, 'a', { numberOfOutputs: 0 });

            audioWorkletNode.port.onmessage = () => (isCallingProcess = true);

            gainNode.connect(audioWorkletNode);

            await offlineAudioContext.startRendering();
        } catch {
            // Ignore errors.
        } finally {
            URL.revokeObjectURL(url);
        }

        return isCallingProcess;
    };
};
