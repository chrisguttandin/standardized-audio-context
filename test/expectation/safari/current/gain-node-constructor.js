describe('gainNodeConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
    });

    // bug #33

    it('should not allow to construct a GainNode', () => {
        expect(() => {
            new GainNode(audioContext, {});
        }).to.throw(TypeError, 'Illegal constructor');
    });
});
