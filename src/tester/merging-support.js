import { Inject } from '@angular/core/src/di/decorators';
import { audioContextConstructor } from '../audio-context-constructor';

/**
 * Firefox up to version 44 had a bug which resulted in a misbehaving ChannelMergerNode. If one of
 * its channels would be unconnected the remaining channels were somehow upmixed to spread the
 * signal across all available channels.
 */
export class MergingSupportTester {

    constructor (audioContextConstructor) {
        this._audioContextConstructor = audioContextConstructor;
    }

    test () {
        var audioBufferSourceNode,
            audioContext,
            channelMergerNode,
            scriptProcessorNode;

        if (this._audioContextConstructor === null) {
            return Promise.resolve(false);
        }

        return new Promise((resolve) => {
            var audioBuffer,
                startTime;

            audioContext = new this._audioContextConstructor();
            audioBufferSourceNode = audioContext.createBufferSource();
            audioBuffer = audioContext.createBuffer(2, 2, audioContext.sampleRate);
            channelMergerNode = audioContext.createChannelMerger(2);
            // @todo remove this ugly hack
            scriptProcessorNode = audioContext._unpatchedAudioContext.createScriptProcessor(256);

            // @todo Safari does not play/loop 1 sample buffers. This should be patched.
            audioBuffer.getChannelData(0)[0] = 1;
            audioBuffer.getChannelData(0)[1] = 1;
            audioBuffer.getChannelData(1)[0] = 1;
            audioBuffer.getChannelData(1)[1] = 1;

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.loop = true;

            scriptProcessorNode.onaudioprocess = (event) => {
                var channelData = event.inputBuffer.getChannelData(1);

                for (let i = 0, length = channelData.length; i < length; i += 1) {
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

MergingSupportTester.parameters = [ [ new Inject(audioContextConstructor) ] ];
