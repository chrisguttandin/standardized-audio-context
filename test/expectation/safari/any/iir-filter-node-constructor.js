describe('iIRFilterNodeConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
    });

    // bug #33

    it('should not allow to construct a IIRFilterNode', () => {
        expect(() => {
            new IIRFilterNode(audioContext, { feedback: [1], feedforward: [1] });
        }).to.throw(ReferenceError, "Can't find variable: IIRFilterNode");
    });
});
