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

                    audioContext.audioWorklet.addModule('base/test/fixtures/gibberish-processor.js').catch((err) => {
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

                    audioContext.audioWorklet.addModule('base/test/fixtures/unparsable-processor.xs').catch((err) => {
                        expect(err.code).to.equal(20);
                        expect(err.name).to.equal('AbortError');

                        done();
                    });
                });
            });
        });
    });
});
