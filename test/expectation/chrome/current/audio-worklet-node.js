describe('AudioWorklet', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('without any automation', () => {

        // bug #85

        it('should call process() with the full array of values for each parameter', (done) => {
            audioContext.audioWorklet
                .addModule('base/test/fixtures/inspector-processor.js')
                .then(() => {
                    const audioWorkletNode = new AudioWorkletNode(audioContext, 'inspector-processor');
                    const values = new Array(128);

                    values.fill(1);

                    audioWorkletNode.port.onmessage = ({ data }) => {
                        audioWorkletNode.port.onmessage = null;
                        expect(Array.from(data.parameters.gain)).to.deep.equal(values);

                        done();
                    };

                    audioWorkletNode.connect(audioContext.destination);
                });
        });

    });

});
