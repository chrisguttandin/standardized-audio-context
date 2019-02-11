import { spy } from 'sinon';

describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('outputLatency', () => {

        // bug #40

        it('should not be implemented', () => {
            expect(audioContext.outputLatency).to.be.undefined;
        });

    });

    describe('state', () => {

        // bug #34

        it('should be set to running right away', () => {
            expect(audioContext.state).to.equal('running');
        });

    });

    describe('close()', () => {

        // bug #50

        it('should not allow to create AudioNodes on a closed context', (done) => {
            audioContext
                .close()
                .then(() => {
                    audioContext.createGain();
                })
                .catch(() => {
                    // Create a closeable AudioContext to align the behaviour with other tests.
                    audioContext = new AudioContext();

                    done();
                });
        });

    });

    describe('createBufferSource()', () => {

        describe('stop()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const audioBufferSourceNode = audioContext.createBufferSource();

                expect(() => audioBufferSourceNode.stop(-1)).to.throw(DOMException).with.property('name', 'InvalidStateError');
            });

        });

    });

    describe('decodeAudioData()', () => {

        // bug #6

        it('should not call the errorCallback at all', (done) => {
            const errorCallback = spy();

            audioContext.decodeAudioData(null, () => {}, errorCallback);

            setTimeout(() => {
                expect(errorCallback).to.have.not.been.called;

                done();
            }, 1000);
        });

    });

});
