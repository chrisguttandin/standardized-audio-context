describe('oscillatorNodeConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    // bug #33

    it('should not allow to construct a OscillatorNode', () => {
        expect(() => {
            new OscillatorNode(audioContext, {});
        }).to.throw(TypeError, 'Function expected');
    });
});
