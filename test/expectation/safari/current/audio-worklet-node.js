describe('AudioWorklet', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256, 44100);
    });

    describe('with processorOptions with an unclonable value', () => {
        // bug #191

        it('should not throw an error', async function () {
            this.timeout(10000);

            await offlineAudioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');

            new AudioWorkletNode(offlineAudioContext, 'gain-processor', { processorOptions: { fn: () => {} } });
        });
    });
});
