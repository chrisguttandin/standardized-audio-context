describe('AudioWorklet', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('with a processor with parameters', () => {
        beforeEach(async function () {
            this.timeout(10000);

            await offlineAudioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');
        });

        describe('without specified maxValue and minValue values', () => {
            // bug #82

            it('should be 3.402820018375656e+38 and -3.402820018375656e+38', () => {
                const audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'gain-processor');

                expect(audioWorkletNode.parameters.get('gain').maxValue).to.equal(3.402820018375656e38);
                expect(audioWorkletNode.parameters.get('gain').minValue).to.equal(-3.402820018375656e38);
            });
        });
    });
});
