describe('AudioWorkletNode', () => {
    // bug #61

    it('should not be implemented', () => {
        expect(window.AudioWorkletNode).to.be.undefined;
    });
});
