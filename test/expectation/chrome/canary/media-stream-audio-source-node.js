describe('MediaStreamAudioSourceNode', () => {
    // bug #207

    it('should have a maximum delay of 1472 samples', async () => {
        while (true) {
            const audioContext = new AudioContext();

            await audioContext.audioWorklet.addModule('base/test/fixtures/delayed-frames-detector-processor.js');
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
