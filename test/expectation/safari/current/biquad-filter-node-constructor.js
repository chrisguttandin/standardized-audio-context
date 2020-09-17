describe('biquadFilterNodeConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
    });

    // bug #33

    it('should not allow to construct a BiquadFilterNode', () => {
        expect(() => {
            new BiquadFilterNode(audioContext, {});
        }).to.throw(TypeError, 'Illegal constructor');
    });
});
