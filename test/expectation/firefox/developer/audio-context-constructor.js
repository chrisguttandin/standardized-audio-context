describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('createBuffer()', () => {

        // bug #42

        describe('copyFromChannel()/copyToChannel()', () => {

            let audioBuffer;

            beforeEach(() => {
                audioBuffer = audioContext.createBuffer(2, 100, 44100);
            });

            it('should allow to copy values with an offset equal to the the length of the source', () => {
                const source = new Float32Array(10);

                audioBuffer.copyToChannel(source, 0, 100);
            });

        });

    });

});
