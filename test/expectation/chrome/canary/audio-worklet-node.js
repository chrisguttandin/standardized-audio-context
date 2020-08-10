describe('AudioWorklet', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('with a failing processor', () => {
        beforeEach(async function () {
            this.timeout(10000);

            await offlineAudioContext.audioWorklet.addModule('base/test/fixtures/failing-processor.js');
        });

        // bug #178

        it('should fire an error event', function (done) {
            this.timeout(10000);

            const audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'failing-processor');

            audioWorkletNode.onprocessorerror = function (event) {
                expect(event.type).to.equal('error');

                done();
            };

            audioWorkletNode.connect(offlineAudioContext.destination);

            offlineAudioContext.startRendering();
        });
    });
});
