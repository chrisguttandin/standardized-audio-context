describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('audioWorklet', () => {

        describe('addModule()', () => {

            describe('with a module which contains an import statement', () => {

                // bug #176

                it('should throw an error', function (done) {
                    this.timeout(10000);

                    audioContext.audioWorklet
                        .addModule('base/test/fixtures/gibberish-processor.js')
                        .catch((err) => {
                            expect(err.code).to.equal(20);
                            expect(err.name).to.equal('AbortError');

                            done();
                        });
                });

            });

            describe('with an unparsable module', () => {

                // bug #177

                it('should return a promise which rejects an AbortError', function (done) {
                    this.timeout(10000);

                    audioContext.audioWorklet
                        .addModule('base/test/fixtures/unparsable-processor.xs')
                        .catch((err) => {
                            expect(err.code).to.equal(20);
                            expect(err.name).to.equal('AbortError');

                            done();
                        });
                });

            });

        });

    });

    describe('createBuffer()', () => {

        // bug #157

        describe('copyFromChannel()/copyToChannel()', () => {

            let audioBuffer;

            beforeEach(() => {
                audioBuffer = audioContext.createBuffer(2, 100, 44100);
            });

            it('should not allow to copy values with a bufferOffset greater than the length of the AudioBuffer', () => {
                const source = new Float32Array(10);

                expect(() => audioBuffer.copyToChannel(source, 0, 101)).to.throw(Error);
            });

        });

    });

});
