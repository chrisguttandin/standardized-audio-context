import { TTestChannelMergerNodeSupportFactory } from '../types';

/**
 * Firefox up to version 44 had a bug which resulted in a misbehaving ChannelMergerNode. If one of
 * its channels would be unconnected the remaining channels were somehow upmixed to spread the
 * signal across all available channels.
 */
export const createTestChannelMergerNodeSupport: TTestChannelMergerNodeSupportFactory = (nativeAudioContextConstructor) => {
    return () => {
        if (nativeAudioContextConstructor === null) {
            return Promise.resolve(false);
        }

        const audioContext = new nativeAudioContextConstructor();
        const audioBufferSourceNode = audioContext.createBufferSource();
        const audioBuffer = audioContext.createBuffer(2, 2, audioContext.sampleRate);
        const channelMergerNode = audioContext.createChannelMerger(2);
        const scriptProcessorNode = (<any> audioContext).createScriptProcessor(256);

        return new Promise<boolean>((resolve) => {
            let startTime: number;

            // @todo Safari does not play/loop 1 sample buffers. This should be patched.
            audioBuffer.getChannelData(0)[0] = 1;
            audioBuffer.getChannelData(0)[1] = 1;
            audioBuffer.getChannelData(1)[0] = 1;
            audioBuffer.getChannelData(1)[1] = 1;

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.loop = true;

            scriptProcessorNode.onaudioprocess = (event: AudioProcessingEvent) => {
                const channelData = event.inputBuffer.getChannelData(1);

                const length = channelData.length;

                for (let i = 0; i < length; i += 1) {
                    if (channelData[i] !== 0) {
                        resolve(false);

                        return;
                    }
                }

                if (startTime + (1 / audioContext.sampleRate) < event.playbackTime) {
                    resolve(true);
                }
            };

            audioBufferSourceNode.connect(channelMergerNode, 0, 0);
            channelMergerNode.connect(scriptProcessorNode);
            scriptProcessorNode.connect(audioContext.destination);

            startTime = audioContext.currentTime;

            audioBufferSourceNode.start(startTime);
        })
            .then((result) => {
                audioBufferSourceNode.stop();

                audioBufferSourceNode.disconnect();
                channelMergerNode.disconnect();
                scriptProcessorNode.disconnect();

                audioContext.close();

                return result;
            });
    };
};
