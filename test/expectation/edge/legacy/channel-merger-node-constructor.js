describe('channelMergerNodeConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    // bug #33

    it('should not allow to construct a ChannelMergerNode', () => {
        expect(() => {
            new ChannelMergerNode(audioContext, {});
        }).to.throw(TypeError, 'Function expected');
    });

});
