describe('channelMergerNodeConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
    });

    // bug #33

    it('should not allow to construct a ChannelMergerNode', () => {
        expect(() => {
            new ChannelMergerNode(audioContext, {});
        }).to.throw(TypeError, 'Illegal constructor');
    });
});
