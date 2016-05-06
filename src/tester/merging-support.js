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
        var audioContext,
            bufferSource,
            channelMerger,
            scriptProcessor;

        if (this._audioContextConstructor === null) {
            return Promise.resolve(false);
        }

        return new Promise((resolve) => {
            var buffer,
                startTime;

            audioContext = new this._audioContextConstructor();
            bufferSource = audioContext.createBufferSource();
            buffer = audioContext.createBuffer(2, 1, audioContext.sampleRate);
            channelMerger = audioContext.createChannelMerger(2);
            // @todo remove this ugly hack
            scriptProcessor = audioContext._unpatchedAudioContext.createScriptProcessor(256);

            buffer.getChannelData(0)[0] = 1;
            buffer.getChannelData(1)[0] = 1;

            bufferSource.buffer = buffer;

            scriptProcessor.onaudioprocess = (event) => {
                var channelData = event.inputBuffer.getChannelData(1);

                for (let i = 0, length = channelData.length; i < length; i += 1) {
                    if (channelData[i] !== 0) {
                        resolve(false);

                        return;
                    }
                }

                if (startTime + 1 / audioContext.sampleRate < event.playbackTime) {
                    resolve(true);
                }
            };

            bufferSource.connect(channelMerger, 0, 0);
            channelMerger.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);

            startTime = audioContext.currentTime;

            bufferSource.start(startTime);
        })
            .then((result) => {
                bufferSource.stop();

                bufferSource.disconnect();
                channelMerger.disconnect();
                scriptProcessor.disconnect();

                audioContext.close();

                return result;
            });
    }

}

MergingSupportTester.parameters = [ [ new Inject(audioContextConstructor) ] ];
