describe('offlineAudioContextConstructor', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new webkitOfflineAudioContext(1, 25600, 44100); // eslint-disable-line new-cap, no-undef
    });

    it('should not provide an unprefixed constructor', () => {
        expect(window.OfflineAudioContext).to.be.undefined;
    });

    describe('createChannelMerger()', () => {
        // bug #15

        it('should have a wrong channelCount', () => {
            const channelMergerNode = offlineAudioContext.createChannelMerger();

            expect(channelMergerNode.channelCount).to.not.equal(1);
        });

        it('should have a wrong channelCountMode', () => {
            const channelMergerNode = offlineAudioContext.createChannelMerger();

            expect(channelMergerNode.channelCountMode).to.not.equal('explicit');
        });

        // bug #16

        it('should allow to set the channelCountMode', () => {
            const channelMergerNode = offlineAudioContext.createChannelMerger();

            channelMergerNode.channelCountMode = 'clamped-max';
        });
    });

    describe('createChannelSplitter()', () => {
        // bug #96

        it('should have a wrong channelCount', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter(6);

            expect(channelSplitterNode.channelCount).to.equal(2);
        });

        // bug #97

        it('should allow to set the channelCount', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            channelSplitterNode.channelCount = 6;
            channelSplitterNode.channelCount = 2;
        });

        // bug #29

        it('should have a channelCountMode of max', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            expect(channelSplitterNode.channelCountMode).to.equal('max');
        });

        // bug #30

        it('should allow to set the channelCountMode', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            channelSplitterNode.channelCountMode = 'explicit';
            channelSplitterNode.channelCountMode = 'max';
        });

        // bug #31

        it('should have a channelInterpretation of speakers', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
        });

        // bug #32

        it('should allow to set the channelInterpretation', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            channelSplitterNode.channelInterpretation = 'discrete';
            channelSplitterNode.channelInterpretation = 'speakers';
        });
    });
});
