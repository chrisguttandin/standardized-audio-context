import { spy } from 'sinon';

describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('audioWorklet', () => {
        describe('addModule()', () => {
            describe('with an empty string as name', () => {
                // bug #134

                it('should not throw an error', function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/empty-string-processor.js');
                });
            });

            describe('with a duplicate name', () => {
                beforeEach(function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');
                });

                // bug #135

                it('should not throw an error', function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/duplicate-gain-processor.js');
                });
            });

            describe('with a processor without a valid constructor', () => {
                // bug #136

                it('should not throw an error', function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/unconstructible-processor.js');
                });
            });

            describe('with a processor without a prototype', () => {
                // Bug #137

                it('should not throw an error', function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/prototypeless-processor.js');
                });
            });

            describe('with a processor with an invalid parameterDescriptors property', () => {
                // Bug #139

                it('should not throw an error', function () {
                    this.timeout(10000);

                    return audioContext.audioWorklet.addModule('base/test/fixtures/invalid-parameter-descriptors-property-processor.js');
                });
            });

            describe('with an unparsable module', () => {
                // bug #182

                it('should return a promise which rejects a SyntaxError', function (done) {
                    this.timeout(10000);

                    audioContext.audioWorklet.addModule('base/test/fixtures/unparsable-processor.xs').catch((err) => {
                        expect(err).to.be.an.instanceOf(SyntaxError);

                        done();
                    });
                });
            });
        });
    });

    describe('destination', () => {
        describe('numberOfOutputs', () => {
            // bug #168

            it('should be zero', () => {
                expect(audioContext.destination.numberOfOutputs).to.equal(0);
            });
        });
    });

    describe('state', () => {
        // bug #34

        it('should be set to running right away', () => {
            expect(audioContext.state).to.equal('running');
        });
    });

    describe('createBufferSource()', () => {
        describe('stop()', () => {
            // bug #44

            it('should throw a DOMException', () => {
                const audioBufferSourceNode = audioContext.createBufferSource();

                expect(() => audioBufferSourceNode.stop(-1))
                    .to.throw(DOMException)
                    .with.property('name', 'InvalidStateError');
            });
        });
    });

    describe('createMediaStreamTrackSource()', () => {
        // bug #121

        it('should not be implemented', () => {
            expect(audioContext.createMediaStreamTrackSource).to.be.undefined;
        });
    });

    describe('createWaveShaper()', () => {
        describe('curve', () => {
            // bug #104

            it('should throw an InvalidAccessError when assigning a curve with less than two samples', (done) => {
                const waveShaperNode = audioContext.createWaveShaper();

                try {
                    waveShaperNode.curve = new Float32Array([1]);
                } catch (err) {
                    expect(err.code).to.equal(15);
                    expect(err.name).to.equal('InvalidAccessError');

                    done();
                }
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
