describe('analyserNodeConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
    });

    // bug #33

    it('should not allow to construct a AnalyserNode', () => {
        expect(() => {
            new AnalyserNode(audioContext, {});
        }).to.throw(TypeError, 'Illegal constructor');
    });
});
