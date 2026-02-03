import { afterEach, beforeEach, describe, it } from 'vitest';

describe('MediaStream', () => {
    let audioContext;

    afterEach(() => {
        return audioContext.close();
    });

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    // bug #214

    it('should not be possible to be stopped', async () => {
        const analyserNode = new AnalyserNode(audioContext);
        const mediaStreamAudioDestinationNode = new MediaStreamAudioDestinationNode(audioContext);
        const mediaStream = mediaStreamAudioDestinationNode.stream;
        const mediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(audioContext, { mediaStream });
        const oscillatorNode = new OscillatorNode(audioContext);

        mediaStreamAudioSourceNode.connect(analyserNode);
        oscillatorNode.connect(mediaStreamAudioDestinationNode);

        oscillatorNode.start();

        const floatTimeDomainData = new Float32Array(analyserNode.fftSize);

        await new Promise((resolve) => {
            const intervalId = setInterval(() => {
                analyserNode.getFloatTimeDomainData(floatTimeDomainData);

                if (floatTimeDomainData.some((sample) => sample !== 0)) {
                    clearInterval(intervalId);
                    resolve();
                }
            });
        });

        for (const mediaStreamTrack of mediaStream.getAudioTracks()) {
            mediaStreamTrack.stop();
        }

        const startTime = audioContext.currentTime;

        await new Promise((resolve, reject) => {
            const intervalId = setInterval(() => {
                analyserNode.getFloatTimeDomainData(floatTimeDomainData);

                if (floatTimeDomainData.every((sample) => sample === 0)) {
                    clearInterval(intervalId);
                    reject(new Error('The MediaStream is expected to not be stopped.'));
                } else if (audioContext.currentTime - startTime > 1) {
                    clearInterval(intervalId);
                    resolve();
                }
            });
        });

        oscillatorNode.stop();

        mediaStreamAudioSourceNode.disconnect(analyserNode);
        oscillatorNode.disconnect(mediaStreamAudioDestinationNode);
    });
});
