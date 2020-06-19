describe('oscillatorNodeConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
    });

    // bug #33

    it('should not allow to construct a OscillatorNode', () => {
        expect(() => {
            new OscillatorNode(audioContext, {});
        }).to.throw(TypeError, "function is not a constructor (evaluating 'new OscillatorNode(audioContext, {})')");
    });
});
