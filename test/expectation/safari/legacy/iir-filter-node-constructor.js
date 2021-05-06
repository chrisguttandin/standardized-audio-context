describe('iIRFilterNodeConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        const audioContextConstructor = typeof webkitAudioContext === 'undefined' ? AudioContext : webkitAudioContext; // eslint-disable-line no-undef

        audioContext = new audioContextConstructor(); // eslint-disable-line new-cap
    });

    // bug #33

    it('should not allow to construct a IIRFilterNode', () => {
        expect(() => {
            new IIRFilterNode(audioContext, { feedback: [1], feedforward: [1] });
        }).to.throw(ReferenceError, "Can't find variable: IIRFilterNode");
    });
});
