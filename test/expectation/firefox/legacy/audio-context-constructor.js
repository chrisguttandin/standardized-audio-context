describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('audioWorklet', () => {
        // bug #59

        it('should not be implemented', () => {
            expect(audioContext.audioWorklet).to.be.undefined;
        });
    });

    describe('close()', () => {
        // bug #35

        it('should not throw an error if it was closed before', () => {
            return audioContext.close().then(() => audioContext.close());
        });
    });

    describe('createBuffer()', () => {
        // bug #99

        describe('with zero as the numberOfChannels', () => {
            it('should throw an IndexSizeError', (done) => {
                try {
                    audioContext.createBuffer(0, 10, 44100);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });
        });

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

    describe('createBufferSource()', () => {
        describe('buffer', () => {
            // bug #72

            it('should allow to assign the buffer multiple times', () => {
                const audioBufferSourceNode = audioContext.createBufferSource();

                audioBufferSourceNode.buffer = audioContext.createBuffer(2, 100, 44100);
                audioBufferSourceNode.buffer = audioContext.createBuffer(2, 100, 44100);
            });
        });
    });

    describe('createOscillator()', () => {
        let oscillatorNode;

        beforeEach(() => {
            oscillatorNode = audioContext.createOscillator();
        });

        describe('start()', () => {
            // bug #44

            it('should throw a DOMException', () => {
                expect(() => oscillatorNode.start(-1))
                    .to.throw(DOMException)
                    .with.property('name', 'NotSupportedError');
            });
        });

        describe('stop()', () => {
            // bug #44

            it('should throw a DOMException', () => {
                expect(() => oscillatorNode.stop(-1))
                    .to.throw(DOMException)
                    .with.property('name', 'NotSupportedError');
            });
        });
    });
});
