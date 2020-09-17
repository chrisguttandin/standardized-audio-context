describe('channelSplitterNodeConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
    });

    // bug #33

    it('should not allow to construct a ChannelSplitterNode', () => {
        expect(() => {
            new ChannelSplitterNode(audioContext, {});
        }).to.throw(TypeError, 'Illegal constructor');
    });
});
