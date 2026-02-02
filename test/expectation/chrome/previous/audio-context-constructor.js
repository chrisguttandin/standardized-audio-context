import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { spy } from 'sinon';

describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('audioWorklet', () => {
        describe('port', () => {
            // bug #202

            it('should not be implemented', () => {
                expect(audioContext.audioWorklet.port).to.be.undefined;
            });
        });

        describe('addModule()', () => {
            describe('with an empty string as name', () => {
                // bug #134

                it('should not throw an error', () => audioContext.audioWorklet.addModule('test/fixtures/empty-string-processor.js'));
            });

            describe('with a duplicate name', () => {
                beforeEach(() => audioContext.audioWorklet.addModule('test/fixtures/gain-processor.js'));

                // bug #135

                it('should not throw an error', () => audioContext.audioWorklet.addModule('test/fixtures/duplicate-gain-processor.js'));
            });

            describe('with a processor without a valid constructor', () => {
                // bug #136

                it('should not throw an error', () => audioContext.audioWorklet.addModule('test/fixtures/unconstructible-processor.js'));
            });

            describe('with a processor without a prototype', () => {
                // Bug #137

                it('should not throw an error', () => audioContext.audioWorklet.addModule('test/fixtures/prototypeless-processor.js'));
            });

            describe('with a processor with an invalid parameterDescriptors property', () => {
                // Bug #139

                it('should not throw an error', () =>
                    audioContext.audioWorklet.addModule('test/fixtures/invalid-parameter-descriptors-property-processor.js'));
            });

            describe('with an unparsable module', () => {
                let url;

                afterEach(() => {
                    URL.revokeObjectURL(url);
                });

                beforeEach(async () => {
                    url = URL.createObjectURL(
                        await fetch(new URL('../../../fixtures/unparsable-processor.js', import.meta.url))
                            .then((response) => response.text())
                            .then((text) => text.replace("// some 'unparsable' syntax ()", "some 'unparsable' syntax ()"))
                            .then((text) => new Blob([text], { type: 'application/javascript; charset=utf-8' }))
                    );
                });

                // bug #182

                it('should return a promise which rejects a SyntaxError', () => {
                    return audioContext.audioWorklet.addModule(url).then(
                        () => {
                            throw new Error('This should never be called.');
                        },
                        (err) => {
                            expect(err).to.be.an.instanceOf(SyntaxError);
                        }
                    );
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

    describe('playoutStats', () => {
        // bug #203

        it('should not be implemented', () => {
            expect(audioContext.playoutStats).to.be.undefined;
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

            it('should throw an InvalidAccessError when assigning a curve with less than two samples', () => {
                const waveShaperNode = audioContext.createWaveShaper();

                expect(() => {
                    waveShaperNode.curve = new Float32Array([1]);
                })
                    .to.throw(DOMException)
                    .with.property('name', 'InvalidAccessError');
            });
        });
    });

    describe('decodeAudioData()', () => {
        // bug #6

        it('should not call the errorCallback at all', () => {
            const errorCallback = spy();

            audioContext
                .decodeAudioData(null, () => {}, errorCallback)
                .catch(() => {
                    // Ignore the rejected error.
                });

            return new Promise((resolve) => {
                setTimeout(() => {
                    expect(errorCallback).to.have.not.been.called;

                    resolve();
                }, 1000);
            });
        });
    });
});
