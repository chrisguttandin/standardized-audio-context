describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('createIIRFilter()', () => {

        describe('getFrequencyResponse()', () => {

            // bug #23

            it('should not throw an InvalidAccessError', () => {
                const iIRFilterNode = audioContext.createIIRFilter([ 1 ], [ 1 ]);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
            });

            // bug #24

            it('should not throw an InvalidAccessError', () => {
                const iIRFilterNode = audioContext.createIIRFilter([ 1 ], [ 1 ]);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
            });

        });

    });

});
