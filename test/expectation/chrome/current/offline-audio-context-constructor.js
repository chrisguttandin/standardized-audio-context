describe('offlineAudioContextConstructor', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('createDelay()', () => {
        // bug #185

        it('should add an extra sample', () => {
            const constantSourceNode = new ConstantSourceNode(offlineAudioContext);
            const delayNode = offlineAudioContext.createDelay();

            delayNode.delayTime.value = 3 / offlineAudioContext.sampleRate;

            constantSourceNode.connect(delayNode).connect(offlineAudioContext.destination);

            constantSourceNode.start();

            return offlineAudioContext.startRendering().then((audioBuffer) => {
                const channelData = new Float32Array(5);

                audioBuffer.copyFromChannel(channelData, 0);

                expect(Array.from(channelData)).to.deep.equal([0, 0, 0, 0, 1]);
            });
        });
    });
});
