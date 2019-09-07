describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('baseLatency', () => {

        // bug #39

        it('should not be implemented', () => {
            expect(audioContext.baseLatency).to.be.undefined;
        });

    });

    describe('outputLatency', () => {

        // bug #40

        it('should not be implemented', () => {
            expect(audioContext.outputLatency).to.be.undefined;
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

    describe('createChannelMerger()', () => {

        // bug #16

        it('should allow to set the channelCountMode', () => {
            const channelMergerNode = audioContext.createChannelMerger();

            channelMergerNode.channelCountMode = 'max';
        });

    });

    describe('createMediaElementSource()', () => {

        describe('mediaElement', () => {

            let mediaElementAudioSourceNode;

            beforeEach(() => {
                mediaElementAudioSourceNode = audioContext.createMediaElementSource(new Audio());
            });

            // bug #63

            it('should not be implemented', () => {
                expect(mediaElementAudioSourceNode.mediaElement).to.be.undefined;
            });

        });

    });

    describe('createMediaStreamSource()', () => {

        describe('mediaStream', () => {

            let mediaStreamAudioSourceNode;

            beforeEach(() => {
                mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(audioContext.createMediaStreamDestination().stream);
            });

            // bug #63

            it('should not be implemented', () => {
                expect(mediaStreamAudioSourceNode.mediaStream).to.be.undefined;
            });

        });

    });

    describe('getOutputTimestamp()', () => {

        // bug #38

        it('should not be implemented', () => {
            expect(audioContext.getOutputTimestamp).to.be.undefined;
        });

    });

});
