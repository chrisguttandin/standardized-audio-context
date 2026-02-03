import { describe, it } from 'vitest';

describe('MediaStreamAudioSourceNode', () => {
    describe('when sending audio through a MediaStream', () => {
        // bug #207

        it('should have a maximum delay of 1472 samples', async () => {
            while (true) {
                const audioContext = new AudioContext();

                await audioContext.audioWorklet.addModule('test/fixtures/delayed-frames-detector-processor.js');
                await audioContext.suspend();

                const audioWorkletNode = new AudioWorkletNode(audioContext, 'delayed-frames-detector-processor');
                const constantSourceNode = new ConstantSourceNode(audioContext);
                const mediaStreamAudioDestinationNode = new MediaStreamAudioDestinationNode(audioContext);
                const mediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(audioContext, {
                    mediaStream: mediaStreamAudioDestinationNode.stream
                });

                constantSourceNode.connect(audioWorkletNode);
                constantSourceNode.connect(mediaStreamAudioDestinationNode);
                constantSourceNode.start();
                mediaStreamAudioSourceNode.connect(audioWorkletNode);

                const [delay] = await Promise.all([
                    new Promise((resolve) => {
                        audioWorkletNode.port.onmessage = ({ data }) => {
                            audioWorkletNode.port.onmessage = null;

                            audioWorkletNode.port.close();
                            constantSourceNode.disconnect(audioWorkletNode);
                            constantSourceNode.disconnect(mediaStreamAudioDestinationNode);
                            constantSourceNode.stop();
                            mediaStreamAudioSourceNode.disconnect(audioWorkletNode);
                            resolve(data);
                        };
                    }),
                    audioContext.resume()
                ]);

                await audioContext.close();

                if (delay === 1472) {
                    return;
                }

                if (delay > 1472) {
                    throw new Error(`The delay should have been a maximum of 1472 samples, but was ${delay} instead.`);
                }
            }
        });
    });

    describe('when calling stop on a MediaStream', () => {
        // bug #215

        it('should have a maximum delay of 3072 samples', async () => {
            while (true) {
                const audioContext = new AudioContext();
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
                const delay = await new Promise((resolve) => {
                    const intervalId = setInterval(() => {
                        analyserNode.getFloatTimeDomainData(floatTimeDomainData);

                        if (floatTimeDomainData.every((sample) => sample === 0)) {
                            clearInterval(intervalId);
                            resolve(Math.round((audioContext.currentTime - startTime) * audioContext.sampleRate));
                        }
                    });
                });

                oscillatorNode.stop();

                mediaStreamAudioSourceNode.disconnect(analyserNode);
                oscillatorNode.disconnect(mediaStreamAudioDestinationNode);

                await audioContext.close();

                if (delay === 3072) {
                    return;
                }

                if (delay > 3072) {
                    throw new Error(`The delay should have been a maximum of 3072 samples, but was ${delay} instead.`);
                }
            }
        });
    });
});
