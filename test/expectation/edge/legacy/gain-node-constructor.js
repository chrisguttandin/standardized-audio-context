describe('gainNodeConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    // bug #33

    it('should not allow to construct a GainNode', () => {
        expect(() => {
            new GainNode(audioContext, {});
        }).to.throw(TypeError, 'Function expected');
    });
});
