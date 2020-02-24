describe('analyserNodeConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    // bug #33

    it('should not allow to construct a AnalyserNode', () => {
        expect(() => {
            new AnalyserNode(audioContext, {});
        }).to.throw(TypeError, 'Function expected');
    });

});
