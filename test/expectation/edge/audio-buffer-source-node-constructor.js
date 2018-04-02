describe('audioBufferSourceNodeConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    // bug #33

    it('should not allow to construct a AudioBufferSourceNode', () => {
        expect(() => {
            new AudioBufferSourceNode(audioContext, {});
        }).to.throw(TypeError, 'Function expected');
    });

});
