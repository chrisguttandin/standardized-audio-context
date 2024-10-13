describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('audioWorklet', () => {
        describe('addModule()', () => {
            describe('with an unparsable module', () => {
                // bug #182

                it('should return a promise which rejects a SyntaxError', function (done) {
                    this.timeout(10000);

                    audioContext.audioWorklet.addModule('base/test/fixtures/unparsable-processor.xs').catch((err) => {
                        expect(err).to.be.an.instanceOf(SyntaxError);

                        done();
                    });
                });
            });
        });
    });
});
