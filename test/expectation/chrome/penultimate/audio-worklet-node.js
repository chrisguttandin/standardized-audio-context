describe('AudioWorklet', () => {
    describe('with a processor with parameters', () => {
        let offlineAudioContext;

        beforeEach(async function () {
            this.timeout(10000);

            offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);

            await offlineAudioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');
        });
    });

    describe('with a failing processor', () => {
        let offlineAudioContext;

        beforeEach(async function () {
            this.timeout(10000);

            offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);

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

    describe('with a closed context', () => {
        let audioContext;

        beforeEach(() => {
            audioContext = new AudioContext();
        });

        beforeEach(async () => {
            await audioContext.close();
            await audioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');
        });

        // bug #186

        it('should throw a DOMException', () => {
            expect(() => new AudioWorkletNode(audioContext, 'gain-processor'))
                .to.throw(
                    DOMException,
                    "Failed to construct 'AudioWorkletNode': AudioWorkletNode cannot be created: No execution context available."
                )
                .with.property('name', 'InvalidStateError');
        });
    });
});
