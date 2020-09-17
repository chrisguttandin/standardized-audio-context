describe('audioBufferConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
    });

    // bug #33

    it('should not allow to construct an AudioBuffer', () => {
        expect(() => {
            new AudioBuffer(audioContext, { length: 1 });
        }).to.throw(TypeError, 'Illegal constructor');
    });
});
