describe('audioBufferConstructor', () => {

    let audioBuffer;

    beforeEach(() => {
        audioBuffer = new AudioBuffer({ length: 10, numberOfChannels: 2, sampleRate: 44100 });
    });

    describe('copyFromChannel()', () => {

        let destination;

        beforeEach(() => {
            destination = new Float32Array(10);
        });

        // bug #89

        it('should throw a NotSupportedError', (done) => {
            try {
                audioBuffer.copyFromChannel(destination, 2);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        // bug #89

        it('should throw a NotSupportedError', (done) => {
            try {
                audioBuffer.copyFromChannel(destination, 0, 10);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

    });

    describe('copyToChannel()', () => {

        let source;

        beforeEach(() => {
            source = new Float32Array(10);
        });

        // bug #89

        it('should throw a NotSupportedError', (done) => {
            try {
                audioBuffer.copyToChannel(source, 2);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        // bug #89

        it('should throw a NotSupportedError', (done) => {
            try {
                audioBuffer.copyToChannel(source, 0, 10);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

    });

});
