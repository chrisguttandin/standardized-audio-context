describe('AudioWorkletNode', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    // bug #179

    describe('with a processor which transfers the arguments', () => {
        let audioWorkletNode;

        beforeEach(async function () {
            this.timeout(10000);

            await offlineAudioContext.audioWorklet.addModule('base/test/fixtures/transferring-processor.js');

            audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'transferring-processor');
        });

        it('should fire an processorerror event', (done) => {
            audioWorkletNode.onprocessorerror = (err) => {
                expect(err.message).to.equal('Unknown processor error');

                done();
            };

            offlineAudioContext.startRendering();
        });
    });
});
