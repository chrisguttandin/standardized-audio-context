import { Inject } from '@angular/core';
import { unpatchedOfflineAudioContextConstructor } from '../unpatched-offline-audio-context-constructor';

export class DisconnectingSupportTester {

    constructor (unpatchedOfflineAudioContextConstructor) {
        this._unpatchedOfflineAudioContextConstructor = unpatchedOfflineAudioContextConstructor;
    }

    test (callback) {
        var channelData,
            dummy,
            offlineAudioContext,
            ones,
            source;

        /* eslint-disable new-cap */
        offlineAudioContext = new this._unpatchedOfflineAudioContextConstructor(1, 2, 44100);
        /* eslint-enable new-cap */

        dummy = offlineAudioContext.createGain();

        // Safari does not play buffers which contain just one frame.
        ones = offlineAudioContext.createBuffer(1, 2, 44100);
        channelData = ones.getChannelData(0);
        channelData[0] = 1;
        channelData[1] = 1;

        source = offlineAudioContext.createBufferSource();
        source.buffer = ones;

        source.connect(offlineAudioContext.destination);
        source.connect(dummy);
        source.disconnect(dummy);

        source.start();

        offlineAudioContext.oncomplete = (event) => {
            var channelData = event.renderedBuffer.getChannelData(0);

            if (channelData[0] === 1) {
                callback(true);
            } else {
                callback(false);
            }

            source.disconnect(offlineAudioContext.destination);
        };
        offlineAudioContext.startRendering();
    }

}

DisconnectingSupportTester.parameters = [ [ new Inject(unpatchedOfflineAudioContextConstructor) ] ];
