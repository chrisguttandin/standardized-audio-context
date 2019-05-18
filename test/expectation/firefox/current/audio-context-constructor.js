describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('close()', () => {

        // bug #50

        it('should not allow to create AudioNodes on a closed context', (done) => {
            audioContext
                .close()
                .then(() => {
                    audioContext.createGain();
                })
                .catch(() => {
                    // Create a closeable AudioContext to align the behaviour with other tests.
                    audioContext = new AudioContext();

                    done();
                });
        });

    });

    describe('createBuffer()', () => {

        // bug #42

        describe('copyFromChannel()/copyToChannel()', () => {

            let audioBuffer;

            beforeEach(() => {
                audioBuffer = audioContext.createBuffer(2, 100, 44100);
            });

            it('should not allow to copy only a part to the source', () => {
                const source = new Float32Array(10);

                expect(() => {
                    audioBuffer.copyToChannel(source, 0, 95);
                }).to.throw(Error);
            });

            it('should not allow to copy only a part of the destination', () => {
                const destination = new Float32Array(10);

                expect(() => {
                    audioBuffer.copyFromChannel(destination, 0, 95);
                }).to.throw(Error);
            });

        });

    });

    describe('createDynamicsCompressor()', () => {

        let dynamicsCompressorNode;

        beforeEach(() => {
            dynamicsCompressorNode = audioContext.createDynamicsCompressor();
        });

        describe('channelCount', () => {

            // bug #108

            it('should not throw an error', () => {
                dynamicsCompressorNode.channelCount = 3;
            });

        });

        describe('channelCountMode', () => {

            // bug #109

            it('should not throw an error', () => {
                dynamicsCompressorNode.channelCountMode = 'max';
            });

        });

    });

    describe('createMediaStreamTrackSource()', () => {

        // bug #121

        it('should not be implemented', () => {
            expect(audioContext.createMediaStreamTrackSource).to.be.undefined;
        });

    });

});
