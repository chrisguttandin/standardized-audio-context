import { TTestAudioBufferSourceNodeStartMethodDurationParameterSupportFactory } from '../types';

// Bug #92: Edge does not respect the duration parameter yet.
export const createTestAudioBufferSourceNodeStartMethodDurationParameterSupport: TTestAudioBufferSourceNodeStartMethodDurationParameterSupportFactory = (
    nativeOfflineAudioContextConstructor
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return Promise.resolve(false);
        }

        const offlineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);
        const audioBuffer = offlineAudioContext.createBuffer(1, 1, offlineAudioContext.sampleRate);
        const audioBufferSourceNode = offlineAudioContext.createBufferSource();

        audioBuffer.getChannelData(0)[0] = 1;

        audioBufferSourceNode.buffer = audioBuffer;
        audioBufferSourceNode.start(0, 0, 0);
        audioBufferSourceNode.connect(offlineAudioContext.destination);

        // Bug #21: Safari does not support promises yet.
        return new Promise((resolve) => {
            offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                // Bug #5: Safari does not support copyFromChannel().
                resolve(renderedBuffer.getChannelData(0)[0] === 0);
            };

            offlineAudioContext.startRendering();
        });
    };
};
