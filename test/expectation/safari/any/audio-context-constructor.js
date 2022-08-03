import { loadFixtureAsArrayBuffer } from '../../../helper/load-fixture';

describe('audioContextConstructor', () => {
    let audioContext;
    let audioContextConstructor;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContextConstructor = typeof webkitAudioContext === 'undefined' ? AudioContext : webkitAudioContext; // eslint-disable-line no-undef
        audioContext = new audioContextConstructor(); // eslint-disable-line new-cap
    });

    describe('destination', () => {
        describe('numberOfOutputs', () => {
            // bug #168

            it('should be zero', () => {
                expect(audioContext.destination.numberOfOutputs).to.equal(0);
            });
        });
    });

    describe('outputLatency', () => {
        // bug #40

        it('should not be implemented', () => {
            expect(audioContext.outputLatency).to.be.undefined;
        });
    });

    describe('createBufferSource()', () => {
        describe('stop()', () => {
            // bug #44

            it('should throw a DOMException when called with a negavtive value', () => {
                const audioBufferSourceNode = audioContext.createBufferSource();

                expect(() => audioBufferSourceNode.stop(-1))
                    .to.throw(DOMException)
                    .with.property('name', 'InvalidStateError');
            });
        });
    });

    describe('createConvolver()', () => {
        let convolverNode;

        beforeEach(() => {
            convolverNode = audioContext.createConvolver();
        });

        describe('buffer', () => {
            // bug #115

            it('should not allow to assign the buffer to null', () => {
                const audioBuffer = audioContext.createBuffer(2, 100, 44100);

                convolverNode.buffer = audioBuffer;
                convolverNode.buffer = null;

                expect(convolverNode.buffer).to.equal(audioBuffer);
            });
        });
    });

    describe('createMediaStreamTrackSource()', () => {
        // bug #121

        it('should not be implemented', () => {
            expect(audioContext.createMediaStreamTrackSource).to.be.undefined;
        });
    });

    describe('decodeAudioData()', () => {
        // bug #4

        it('should throw null when asked to decode an unsupported file', function (done) {
            this.timeout(10000);

            // PNG files are not supported by any browser :-)
            loadFixtureAsArrayBuffer('one-pixel-of-transparency.png').then((arrayBuffer) => {
                audioContext.decodeAudioData(
                    arrayBuffer,
                    () => {},
                    (err) => {
                        expect(err).to.be.null;

                        done();
                    }
                );
            });
        });

        // bug #43

        it('should not throw a DataCloneError', function (done) {
            this.timeout(10000);

            loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav').then((arrayBuffer) => {
                audioContext.decodeAudioData(arrayBuffer, () => {
                    audioContext.decodeAudioData(arrayBuffer, () => done());
                });
            });
        });

        // bug #133

        it('should not neuter the arrayBuffer', function (done) {
            this.timeout(10000);

            loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav').then((arrayBuffer) => {
                audioContext.decodeAudioData(arrayBuffer, () => {
                    expect(arrayBuffer.byteLength).to.not.equal(0);

                    done();
                });
            });
        });
    });
});
