describe('iIRFilterNodeConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    // bug #33

    it('should not allow to construct a IIRFilterNode', () => {
        expect(() => {
            new IIRFilterNode(audioContext, { feedback: [ 1 ], feedforward: [ 1 ] });
        }).to.throw(TypeError, 'Function expected');
    });

});
