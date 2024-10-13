import { expect } from 'chai';

describe('audioContextConstructor', () => {
    describe('with a constructed AudioContext', () => {
        let audioContext;

        afterEach(() => audioContext.close());

        beforeEach(() => {
            audioContext = new AudioContext();
        });

        // Bug #198

        describe('getOutputTimestamp()', () => {
            it('should expose a wrong contextTime', function (done) {
                this.timeout(0);

                setTimeout(() => {
                    expect(audioContext.currentTime).to.above(9);
                    expect(audioContext.getOutputTimestamp().contextTime).to.below(1);
                    expect(audioContext.getOutputTimestamp().contextTime * audioContext.sampleRate).to.above(9);

                    done();
                }, 10000);
            });
        });
    });
});
