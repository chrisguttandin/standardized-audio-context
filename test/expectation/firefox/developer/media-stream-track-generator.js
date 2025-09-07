describe('MediaStreamTrackGenerator', () => {
    // bug #209

    it('should not be implemented', () => {
        expect(typeof MediaStreamTrackGenerator).to.equal('undefined');
    });
});
