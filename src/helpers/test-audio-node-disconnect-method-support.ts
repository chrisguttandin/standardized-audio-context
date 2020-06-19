import { TNativeAudioContext } from '../types';

export const testAudioNodeDisconnectMethodSupport = (nativeAudioContext: TNativeAudioContext): Promise<boolean> => {
    return new Promise((resolve) => {
        const analyzer = nativeAudioContext.createScriptProcessor(256, 1, 1);

        const dummy = nativeAudioContext.createGain();

        // Bug #95: Safari does not play one sample buffers.
        const ones = nativeAudioContext.createBuffer(1, 2, 44100);

        const channelData = ones.getChannelData(0);

        channelData[0] = 1;
        channelData[1] = 1;

        const source = nativeAudioContext.createBufferSource();

        source.buffer = ones;
        source.loop = true;

        source.connect(analyzer).connect(nativeAudioContext.destination);

        source.connect(dummy);
        source.disconnect(dummy);

        // tslint:disable-next-line:deprecation
        analyzer.onaudioprocess = (event) => {
            const chnnlDt = event.inputBuffer.getChannelData(0);

            if (Array.prototype.some.call(chnnlDt, (sample: number) => sample === 1)) {
                resolve(true);
            } else {
                resolve(false);
            }

            source.stop();

            analyzer.onaudioprocess = null; // tslint:disable-line:deprecation

            source.disconnect(analyzer);
            analyzer.disconnect(nativeAudioContext.destination);
        };

        source.start();
    });
};
