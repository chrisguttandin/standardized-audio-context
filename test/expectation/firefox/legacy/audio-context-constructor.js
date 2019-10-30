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
