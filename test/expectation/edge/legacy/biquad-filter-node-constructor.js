describe('biquadFilterNodeConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    // bug #33

    it('should not allow to construct a BiquadFilterNode', () => {
        expect(() => {
            new BiquadFilterNode(audioContext, {});
        }).to.throw(TypeError, 'Function expected');
    });
});
