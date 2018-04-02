describe('offlineAudioContextConstructor', () => {

    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('destination', () => {

        // bug #52

        it('should allow to change the value of the channelCount property', () => {
            offlineAudioContext.destination.channelCount = 2;
        });

        // bug #53

        it('should allow to change the value of the channelCountMode property', () => {
            offlineAudioContext.destination.channelCountMode = 'max';
        });

    });

    describe('createBufferSource()', () => {

        describe('stop()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const bufferSourceNode = offlineAudioContext.createBufferSource();

                expect(() => bufferSourceNode.stop(-1)).to.throw(DOMException);
            });

        });

    });

});
