describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
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

});
