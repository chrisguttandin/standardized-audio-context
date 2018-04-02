describe('offlineAudioContextConstructor', () => {

    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('createIIRFilter()', () => {

        describe('getFrequencyResponse()', () => {

            // bug #23

            it('should not throw an NotSupportedError', () => {
                const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
            });

            // bug #24

            it('should not throw an NotSupportedError', () => {
                const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
            });

        });

    });

});
