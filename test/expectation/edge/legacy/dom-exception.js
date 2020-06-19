describe('DOMException', () => {
    // bug #122

    it('should not allow to construct a DOMException', () => {
        expect(() => {
            new DOMException('', 'IndexSizeError');
        }).to.throw(TypeError, 'Function expected');
    });
});
