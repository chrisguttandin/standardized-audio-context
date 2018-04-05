describe('AudioWorklet', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('with an unknown module', () => {

        // bug #60

        it('should throw an InvalidStateError', (done) => {
            try {
                new AudioWorkletNode(audioContext, 'unknown-processor'); // eslint-disable-line no-undef
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

    });

    describe('with processorOptions set to null', () => {

        // bug #66

        it('should throw a TypeError', async () => {
            await audioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');

            expect(() => {
                new AudioWorkletNode(audioContext, 'gain-processor', { processorOptions: null }); // eslint-disable-line no-undef
            }).to.throw(TypeError, "Failed to construct 'AudioWorkletNode': member processorOptions is not an object.");
        });

    });

    describe('without specified maxValue and minValue values', () => {

        // bug #82

        it('should be 3.402820018375656e+38 and -3.402820018375656e+38', async () => {
            await audioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');

            const audioWorkletNode = new AudioWorkletNode(audioContext, 'gain-processor'); // eslint-disable-line no-undef

            expect(audioWorkletNode.parameters.get('gain').maxValue).to.equal(3.402820018375656e+38);
            expect(audioWorkletNode.parameters.get('gain').minValue).to.equal(-3.402820018375656e+38);
        });

    });

    describe('without any automation', () => {

        // bug #85

        it('should call process() with the full array of values for each parameter', (done) => {
            audioContext.audioWorklet
                .addModule('base/test/fixtures/inspector-processor.js')
                .then(() => {
                    const audioWorkletNode = new AudioWorkletNode(audioContext, 'inspector-processor'); // eslint-disable-line no-undef
                    const values = new Array(128);

                    values.fill(1);

                    audioWorkletNode.port.onmessage = ({ data }) => {
                        expect(Array.from(data.parameters.gain)).to.deep.equal(values);

                        audioWorkletNode.port.onmessage = null;

                        done();
                    };

                    audioWorkletNode.connect(audioContext.destination);
                });
        });

    });

});
