describe('offlineAudioContextConstructor', () => {

    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new webkitOfflineAudioContext(1, 25600, 44100); // eslint-disable-line new-cap, no-undef
    });

    describe('createAnalyser()', () => {

        // bug #11

        it('should not be chainable', () => {
            const analyserNode = offlineAudioContext.createAnalyser(),
                gainNode = offlineAudioContext.createGain();

            expect(analyserNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createBiquadFilter()', () => {

        let biquadFilterNode;

        beforeEach(() => {
            biquadFilterNode = offlineAudioContext.createBiquadFilter();
        });

        // bug #11

        it('should not be chainable', () => {
            const gainNode = offlineAudioContext.createGain();

            expect(biquadFilterNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createBufferSource()', () => {

        // bug #11

        it('should not be chainable', () => {
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const gainNode = offlineAudioContext.createGain();

            expect(audioBufferSourceNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createChannelMerger()', () => {

        // bug #11

        it('should not be chainable', () => {
            const channelMergerNode = offlineAudioContext.createChannelMerger();
            const gainNode = offlineAudioContext.createGain();

            expect(channelMergerNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createChannelSplitter()', () => {

        // bug #11

        it('should not be chainable', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter(),
                gainNode = offlineAudioContext.createGain();

            expect(channelSplitterNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createGain()', () => {

        // bug #11

        it('should not be chainable', () => {
            const gainNodeA = offlineAudioContext.createGain();
            const gainNodeB = offlineAudioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.be.undefined;
        });

    });

    describe('createOscillator()', () => {

        // bug #11

        it('should not be chainable', () => {
            const gainNode = offlineAudioContext.createGain();
            const oscillatorNode = offlineAudioContext.createOscillator();

            expect(oscillatorNode.connect(gainNode)).to.be.undefined;
        });

    });

});
