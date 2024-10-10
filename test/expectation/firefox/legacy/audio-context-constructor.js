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

    describe('createAnalyser()', () => {
        // bug #37

        it('should have a channelCount of 1', () => {
            const analyserNode = audioContext.createAnalyser();

            expect(analyserNode.channelCount).to.equal(1);
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
