describe('offlineAudioContextConstructor', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('audioWorklet', () => {
        // bug #59

        it('should not be implemented', () => {
            expect(offlineAudioContext.audioWorklet).to.be.undefined;
        });
    });

    describe('createBufferSource()', () => {
        describe('buffer', () => {
            // bug #72

            it('should allow to assign the buffer multiple times', () => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBufferSourceNode.buffer = offlineAudioContext.createBuffer(2, 100, 44100);
                audioBufferSourceNode.buffer = offlineAudioContext.createBuffer(2, 100, 44100);
            });
        });
    });

    describe('createOscillator()', () => {
        let oscillatorNode;

        beforeEach(() => {
            oscillatorNode = offlineAudioContext.createOscillator();
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
