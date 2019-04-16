describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
    });

    describe('createAnalyser()', () => {

        // bug #11

        it('should not be chainable', () => {
            const analyserNode = audioContext.createAnalyser();
            const gainNode = audioContext.createGain();

            expect(analyserNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createBiquadFilter()', () => {

        let biquadFilterNode;

        beforeEach(() => {
            biquadFilterNode = audioContext.createBiquadFilter();
        });

        // bug #11

        it('should not be chainable', () => {
            const gainNode = audioContext.createGain();

            expect(biquadFilterNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createBufferSource()', () => {

        // bug #11

        it('should not be chainable', () => {
            const audioBufferSourceNode = audioContext.createBufferSource();
            const gainNode = audioContext.createGain();

            expect(audioBufferSourceNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createChannelMerger()', () => {

        // bug #11

        it('should not be chainable', () => {
            const channelMergerNode = audioContext.createChannelMerger();
            const gainNode = audioContext.createGain();

            expect(channelMergerNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createChannelSplitter()', () => {

        // bug #11

        it('should not be chainable', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();
            const gainNode = audioContext.createGain();

            expect(channelSplitterNode.connect(gainNode)).to.be.undefined;
        });

    });

    describe('createGain()', () => {

        // bug #11

        it('should not be chainable', () => {
            const gainNodeA = audioContext.createGain();
            const gainNodeB = audioContext.createGain();

            expect(gainNodeA.connect(gainNodeB)).to.be.undefined;
        });

    });

    describe('createOscillator()', () => {

        // bug #11

        it('should not be chainable', () => {
            const gainNode = audioContext.createGain();
            const oscillatorNode = audioContext.createOscillator();

            expect(oscillatorNode.connect(gainNode)).to.be.undefined;
        });

    });

});
