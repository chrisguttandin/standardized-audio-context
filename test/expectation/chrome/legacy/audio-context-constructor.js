describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('createBiquadFilter()', () => {
        let biquadFilterNode;

        beforeEach(() => {
            biquadFilterNode = audioContext.createBiquadFilter();
        });

        describe('detune', () => {
            describe('maxValue', () => {
                // bug #78

                it('should be the largest possible positive float value', () => {
                    expect(biquadFilterNode.detune.maxValue).to.equal(3.4028234663852886e38);
                });
            });

            describe('minValue', () => {
                // bug #78

                it('should be the smallest possible negative float value', () => {
                    expect(biquadFilterNode.detune.minValue).to.equal(-3.4028234663852886e38);
                });
            });
        });

        describe('gain', () => {
            describe('maxValue', () => {
                // bug #79

                it('should be the largest possible positive float value', () => {
                    expect(biquadFilterNode.gain.maxValue).to.equal(3.4028234663852886e38);
                });
            });
        });
    });

    describe('createConvolver()', () => {
        let convolverNode;

        beforeEach(() => {
            convolverNode = audioContext.createConvolver();
        });

        describe('channelCount', () => {
            // bug #166

            it('should throw an error', () => {
                expect(() => {
                    convolverNode.channelCount = 1;
                }).to.throw(DOMException);
            });
        });

        describe('channelCountMode', () => {
            // bug #167

            it('should throw an error', () => {
                expect(() => {
                    convolverNode.channelCountMode = 'explicit';
                }).to.throw(DOMException);
            });
        });
    });
});
