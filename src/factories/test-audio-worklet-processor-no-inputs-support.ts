import { TNativeAudioWorkletNodeConstructor, TNativeOfflineAudioContextConstructor } from '../types';

/*
 * Bug #170: Chrome up to version 83 called process() with an array with empty channelData for each input if no input was connected. It also
 * had a couple more bugs but since this is easy to test it's used here as a placeholder.
 *
 * Bug #86: Chrome up to version 83 not invoked the process() function if the corresponding AudioWorkletNode was unconnected but had an
 * output.
 *
 * Bug #156: Chrome up to version 83 dispatched a regular Event instead of an ErrorEvent when invoking the processorerror listeners of an
 * AudioWorkletNode.
 */
export const createTestAudioWorkletProcessorNoInputsSupport = (
    nativeAudioWorkletNodeConstructor: null | TNativeAudioWorkletNodeConstructor,
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor
) => {
    return async () => {
        // Bug #61: If there is no native AudioWorkletNode it gets faked and therefore it is no problem if the it doesn't exist.
        if (nativeAudioWorkletNodeConstructor === null) {
            return true;
        }

        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const blob = new Blob(
            [
                'class A extends AudioWorkletProcessor{process(i){this.port.postMessage(i.length===1&&i[0].length===0)}}registerProcessor("a",A);'
            ],
            { type: 'application/javascript; charset=utf-8' }
        );
        const offlineAudioContext = new nativeOfflineAudioContextConstructor(1, 128, 44100);
        const url = URL.createObjectURL(blob);

        let hasExpectedInputs = false;

        try {
            await offlineAudioContext.audioWorklet.addModule(url);

            const audioWorkletNode = new nativeAudioWorkletNodeConstructor(offlineAudioContext, 'a');

            audioWorkletNode.connect(offlineAudioContext.destination);

            hasExpectedInputs = await new Promise<boolean>((resolve, reject) => {
                audioWorkletNode.port.onmessage = ({ data }) => {
                    audioWorkletNode.port.onmessage = null;

                    resolve(data);
                };

                offlineAudioContext.startRendering().catch(reject);
            });
        } catch {
            // Ignore errors.
        } finally {
            URL.revokeObjectURL(url);
        }

        return hasExpectedInputs;
    };
};
