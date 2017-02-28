export class DisconnectingSupportTester {

    public test (audioContext) {
        return new Promise((resolve, reject) => {
            const analyzer = audioContext.createScriptProcessor(256, 1, 1);

            const dummy = audioContext.createGain();

            // Safari does not play buffers which contain just one frame.
            const ones = audioContext.createBuffer(1, 2, 44100);

            const channelData = ones.getChannelData(0);

            channelData[0] = 1;
            channelData[1] = 1;

            const source = audioContext.createBufferSource();

            source.buffer = ones;
            source.loop = true;

            source.connect(analyzer);
            analyzer.connect(audioContext.destination);
            source.connect(dummy);
            source.disconnect(dummy);

            analyzer.onaudioprocess = (event) => {
                const chnnlDt = event.inputBuffer.getChannelData(0);

                if (Array.prototype.some.call(chnnlDt, (sample) => sample === 1)) {
                    resolve(true);
                } else {
                    resolve(false);
                }

                source.stop();

                analyzer.onaudioprocess = null;

                source.disconnect(analyzer);
                analyzer.disconnect(audioContext.destination);
            };

            source.start();
        });
    }

}
