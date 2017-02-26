import { Inject, Injectable } from '@angular/core';
import { unpatchedAudioContextConstructor } from '../providers/unpatched-audio-context-constructor';

/**
 * Firefox up to version 44 had a bug which resulted in a misbehaving ChannelMergerNode. If one of
 * its channels would be unconnected the remaining channels were somehow upmixed to spread the
 * signal across all available channels.
 */
@Injectable()
export class MergingSupportTester {

    constructor (@Inject(unpatchedAudioContextConstructor) private _UnpatchedAudioContext) { }

    public test () {
        if (this._UnpatchedAudioContext === null) {
            return Promise.resolve(false);
        }

        const audioContext = new this._UnpatchedAudioContext();
        const audioBufferSourceNode = audioContext.createBufferSource();
        const audioBuffer = audioContext.createBuffer(2, 2, audioContext.sampleRate);
        const channelMergerNode = audioContext.createChannelMerger(2);
        const scriptProcessorNode = audioContext.createScriptProcessor(256);

        return new Promise((resolve) => {
            let startTime;

            // @todo Safari does not play/loop 1 sample buffers. This should be patched.
            audioBuffer.getChannelData(0)[0] = 1;
            audioBuffer.getChannelData(0)[1] = 1;
            audioBuffer.getChannelData(1)[0] = 1;
            audioBuffer.getChannelData(1)[1] = 1;

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.loop = true;

            scriptProcessorNode.onaudioprocess = (event) => {
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
    }

}
