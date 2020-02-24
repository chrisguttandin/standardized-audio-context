describe('channelSplitterNodeConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    // bug #33

    it('should not allow to construct a ChannelSplitterNode', () => {
        expect(() => {
            new ChannelSplitterNode(audioContext, {});
        }).to.throw(TypeError, 'Function expected');
    });

});
