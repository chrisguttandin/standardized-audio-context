describe('ErrorEvent', () => {
    let errorEvent;

    beforeEach(() => {
        errorEvent = new ErrorEvent('error');
    });

    describe('error', () => {
        // bug #193

        it('should be null', () => {
            expect(errorEvent.error).to.be.null;
        });
    });
});
