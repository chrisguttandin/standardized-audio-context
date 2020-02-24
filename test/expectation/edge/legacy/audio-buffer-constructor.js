describe('audioBufferConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    // bug #33

    it('should not allow to construct a AudioBuffer', () => {
        expect(() => {
            new AudioBuffer(audioContext, { length: 1 });
        }).to.throw(TypeError, 'Function expected');
    });

});
