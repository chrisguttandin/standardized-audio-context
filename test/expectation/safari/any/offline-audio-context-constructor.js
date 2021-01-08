import { loadFixtureAsArrayBuffer } from '../../../helper/load-fixture';
import { spy } from 'sinon';

describe('offlineAudioContextConstructor', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new webkitOfflineAudioContext(1, 25600, 44100); // eslint-disable-line new-cap, no-undef
    });

    it('should not provide an unprefixed constructor', () => {
        expect(window.OfflineAudioContext).to.be.undefined;
    });

    describe('constructor()', () => {
        describe('with zero as the numberOfChannels', () => {
            // bug #146

            it('should throw a SyntaxError', (done) => {
                try {
                    new webkitOfflineAudioContext(0, 1, 44100); // eslint-disable-line new-cap, no-undef
                } catch (err) {
                    expect(err.code).to.equal(12);
                    expect(err.name).to.equal('SyntaxError');

                    done();
                }
            });
        });

        describe('with 32 as the value for numberOfChannels', () => {
            // bug #142

            it('should throw an error', () => {
                expect(() => {
                    new webkitOfflineAudioContext(32, 1, 44100); // eslint-disable-line new-cap, no-undef
                }).to.throw(DOMException);
            });
        });

        describe('with a length of zero', () => {
            // bug #143

            it('should throw a SyntaxError', (done) => {
                try {
                    new webkitOfflineAudioContext(1, 0, 44100); // eslint-disable-line new-cap, no-undef
                } catch (err) {
                    expect(err.code).to.equal(12);
                    expect(err.name).to.equal('SyntaxError');

                    done();
                }
            });
        });

        describe('with a sampleRate of zero', () => {
            // bug #144

            it('should throw a SyntaxError', (done) => {
                try {
                    new webkitOfflineAudioContext(1, 1, 0); // eslint-disable-line new-cap, no-undef
                } catch (err) {
                    expect(err.code).to.equal(12);
                    expect(err.name).to.equal('SyntaxError');

                    done();
                }
            });
        });

        describe('with OfflineAudioContextOptions', () => {
            // bug #46

            it('should throw a TypeError', () => {
                expect(() => {
                    new webkitOfflineAudioContext({ length: 1, numberOfChannels: 1, sampleRate: 44100 }); // eslint-disable-line new-cap, no-undef
                }).to.throw(TypeError);
            });
        });
    });

    describe('audioWorklet', () => {
        // bug #59

        it('should not be implemented', () => {
            expect(offlineAudioContext.audioWorklet).to.be.undefined;
        });
    });

    describe('destination', () => {
        // bug #52

        it('should allow to change the value of the channelCount property', () => {
            offlineAudioContext.destination.channelCount = 3;
        });

        // bug #53

        it('should allow to change the value of the channelCountMode property', () => {
            offlineAudioContext.destination.channelCountMode = 'explicit';
        });
    });

    describe('length', () => {
        // bug #17

        it('should not expose its length', () => {
            expect(offlineAudioContext.length).to.be.undefined;
        });
    });

    describe('onstatechange', () => {
        // bug #49

        it('should transition directly from suspended to closed', (done) => {
            // eslint-disable-next-line unicorn/consistent-function-scoping
            const runTest = (evaluateTest) => {
                offlineAudioContext = new webkitOfflineAudioContext(1, 1, 44100); // eslint-disable-line new-cap, no-undef

                let previousState = offlineAudioContext.state;

                offlineAudioContext.onstatechange = () => {
                    const currentState = offlineAudioContext.state;

                    if (currentState === 'closed') {
                        offlineAudioContext.onstatechange = null;

                        evaluateTest(previousState === 'suspended');
                    }

                    previousState = currentState;
                };

                // Bug #48: Connect a GainNode to make sure the rendering succeeds.
                offlineAudioContext.createGain().connect(offlineAudioContext.destination);

                offlineAudioContext.startRendering();
            };
            const evaluateTest = (hasTransitionedDirectlyFromSuspendedToClosed) => {
                if (hasTransitionedDirectlyFromSuspendedToClosed) {
                    done();
                } else {
                    runTest(evaluateTest);
                }
            };

            runTest(evaluateTest);
        });
    });

    describe('close()', () => {
        // bug #94

        it('should expose a close method', () => {
            expect(offlineAudioContext.close).to.be.a('function');
        });
    });

    describe('createBufferSource()', () => {
        // bug #14

        it('should not resample an oversampled AudioBuffer', (done) => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 8, 88200);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const eightRandomValues = [];

            for (let i = 0; i < 8; i += 1) {
                eightRandomValues[i] = Math.random() * 2 - 1;

                // Bug #5: Safari does not support copyFromChannel().
                audioBuffer.getChannelData(0)[i] = eightRandomValues[i];
            }

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.start(0);
            audioBufferSourceNode.connect(offlineAudioContext.destination);

            offlineAudioContext.oncomplete = (event) => {
                // Bug #5: Safari does not support copyFromChannel().
                const channelData = event.renderedBuffer.getChannelData(0);

                expect(channelData[0]).to.be.closeTo(eightRandomValues[0], 0.0000001);
                expect(channelData[1]).to.be.closeTo(eightRandomValues[2], 0.0000001);
                expect(channelData[2]).to.be.closeTo(eightRandomValues[4], 0.0000001);
                expect(channelData[3]).to.be.closeTo(eightRandomValues[6], 0.0000001);

                done();
            };
            offlineAudioContext.startRendering();
        });

        // bug #18

        it('should not allow calls to stop() of an AudioBufferSourceNode scheduled for stopping', () => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 100, 44100);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.connect(offlineAudioContext.destination);
            audioBufferSourceNode.start();
            audioBufferSourceNode.stop(1);
            expect(() => {
                audioBufferSourceNode.stop();
            }).to.throw(Error);
        });

        // bug #19

        it('should not ignore calls to stop() of an already stopped AudioBufferSourceNode', (done) => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 100, 44100);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();

            audioBufferSourceNode.onended = () => {
                expect(() => {
                    audioBufferSourceNode.stop();
                }).to.throw(Error);

                done();
            };

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.connect(offlineAudioContext.destination);
            audioBufferSourceNode.start();
            audioBufferSourceNode.stop();

            offlineAudioContext.startRendering();
        });

        // bug #164

        it('should not mute cycles', function (done) {
            this.timeout(10000);

            const audioBuffer = offlineAudioContext.createBuffer(1, 25600, offlineAudioContext.sampleRate);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const gainNode = offlineAudioContext.createGain();

            for (let i = 0; i < 25600; i += 1) {
                audioBuffer.getChannelData(0)[i] = 1;
            }

            audioBufferSourceNode.buffer = audioBuffer;

            audioBufferSourceNode.connect(gainNode).connect(offlineAudioContext.destination);

            gainNode.connect(gainNode);

            audioBufferSourceNode.start(0);

            offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                // Bug #5: Safari does not support copyFromChannel().
                const channelData = renderedBuffer.getChannelData(0);

                for (const sample of channelData) {
                    expect(sample).to.not.equal(0);
                }

                done();
            };
            offlineAudioContext.startRendering();
        });

        describe('buffer', () => {
            // bug #72

            it('should allow to assign the buffer multiple times', () => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBufferSourceNode.buffer = offlineAudioContext.createBuffer(2, 100, 44100);
                audioBufferSourceNode.buffer = offlineAudioContext.createBuffer(2, 100, 44100);
            });
        });

        describe('onended', () => {
            // bug #175

            it('should not fire an ended event listener', (done) => {
                const audioBuffer = offlineAudioContext.createBuffer(1, 2, 44100);
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBufferSourceNode.buffer = audioBuffer;

                const listener = spy();

                audioBufferSourceNode.addEventListener('ended', listener);
                audioBufferSourceNode.start();

                setTimeout(() => {
                    expect(listener).to.have.not.been.called;

                    done();
                }, 500);

                offlineAudioContext.startRendering();
            });
        });

        describe('start()', () => {
            // bug #155

            it('should ignore an offset which equals the duration', (done) => {
                const audioBuffer = offlineAudioContext.createBuffer(1, 3, 44100);
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBuffer.getChannelData(0)[0] = 1;
                audioBuffer.getChannelData(0)[1] = 1;
                audioBuffer.getChannelData(0)[2] = 1;

                audioBufferSourceNode.buffer = audioBuffer;

                audioBufferSourceNode.connect(offlineAudioContext.destination);

                audioBufferSourceNode.start(0, audioBuffer.duration);

                offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                    // Bug #5: Safari does not support copyFromChannel().
                    const channelData = renderedBuffer.getChannelData(0);

                    expect(channelData[0]).to.equal(1);
                    expect(channelData[1]).to.equal(1);
                    expect(channelData[2]).to.equal(1);

                    expect(channelData[3]).to.equal(0);
                    expect(channelData[4]).to.equal(0);
                    expect(channelData[5]).to.equal(0);

                    done();
                };
                offlineAudioContext.startRendering();
            });
        });

        describe('stop()', () => {
            // bug #44

            it('should throw a DOMException', () => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                expect(() => audioBufferSourceNode.stop(-1))
                    .to.throw(DOMException)
                    .with.property('name', 'InvalidStateError');
            });
        });
    });

    describe('createChannelMerger()', () => {
        // bug #20

        it('should not handle unconnected channels as silence', (done) => {
            const sampleRate = offlineAudioContext.sampleRate;
            // Bug #95: Safari does not play/loop one sample buffers.
            const audioBuffer = offlineAudioContext.createBuffer(1, 2, sampleRate);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const channelMergerNode = offlineAudioContext.createChannelMerger(2);

            // Bug #5: Safari does not support copyFromChannel().
            audioBuffer.getChannelData(0)[0] = 1;
            audioBuffer.getChannelData(0)[1] = 1;

            audioBufferSourceNode.buffer = audioBuffer;

            channelMergerNode.channelCountMode = 'explicit';

            audioBufferSourceNode.connect(channelMergerNode, 0, 0).connect(offlineAudioContext.destination);

            audioBufferSourceNode.start(0);

            offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                // Bug #5: Safari does not support copyFromChannel().
                const channelData = renderedBuffer.getChannelData(0);

                expect(channelData[0]).to.equal(1);

                done();
            };
            offlineAudioContext.startRendering();
        });
    });

    describe('createConstantSource()', () => {
        // bug #62

        it('should not be implemented', () => {
            expect(offlineAudioContext.createConstantSource).to.be.undefined;
        });
    });

    describe('createDelay()', () => {
        describe('with a delayTime of 128 samples', () => {
            let audioBufferSourceNode;
            let delayNode;
            let gainNode;

            afterEach(() => {
                audioBufferSourceNode.disconnect(gainNode);
                delayNode.disconnect(gainNode);
                gainNode.disconnect(delayNode);
                gainNode.disconnect(offlineAudioContext.destination);
            });

            beforeEach(() => {
                audioBufferSourceNode = offlineAudioContext.createBufferSource();
                delayNode = offlineAudioContext.createDelay();
                gainNode = offlineAudioContext.createGain();

                // Bug #95: Safari does not play/loop one sample buffers.
                const audioBuffer = offlineAudioContext.createBuffer(1, 2, offlineAudioContext.sampleRate);

                audioBuffer.getChannelData(0)[0] = 2;

                audioBufferSourceNode.buffer = audioBuffer;

                delayNode.delayTime.value = 128 / offlineAudioContext.sampleRate;

                gainNode.gain.value = 0.5;

                audioBufferSourceNode.connect(gainNode).connect(delayNode).connect(gainNode).connect(offlineAudioContext.destination);
            });

            // bug #163

            it('should have a minimum delayTime of 256 samples', function (done) {
                this.timeout(10000);

                audioBufferSourceNode.start(0);

                offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                    // Bug #5: Safari does not support copyFromChannel().
                    const channelData = renderedBuffer.getChannelData(0);

                    expect(channelData[0]).to.equal(1);
                    expect(channelData[256]).to.be.above(0.49);
                    expect(channelData[256]).to.be.below(0.51);

                    done();
                };
                offlineAudioContext.startRendering();
            });
        });
    });

    describe('createDynamicsCompressor()', () => {
        // bug #112

        it('should not have a tail-time', (done) => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 3, 44100);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const dynamicsCompressorNode = offlineAudioContext.createDynamicsCompressor();

            audioBuffer.getChannelData(0)[0] = 1;
            audioBuffer.getChannelData(0)[1] = 1;
            audioBuffer.getChannelData(0)[2] = 1;

            audioBufferSourceNode.buffer = audioBuffer;

            audioBufferSourceNode.connect(dynamicsCompressorNode).connect(offlineAudioContext.destination);

            audioBufferSourceNode.start(0);

            offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                // Bug #5: Safari does not support copyFromChannel().
                const channelData = renderedBuffer.getChannelData(0);

                for (const sample of channelData) {
                    expect(sample).to.equal(0);
                }

                done();
            };
            offlineAudioContext.startRendering();
        });
    });

    describe('createGain()', () => {
        describe('gain', () => {
            describe('value', () => {
                // bug #98

                it('should ignore the value setter while an automation is running', function (done) {
                    this.timeout(10000);

                    const audioBuffer = offlineAudioContext.createBuffer(
                        1,
                        0.5 * offlineAudioContext.sampleRate,
                        offlineAudioContext.sampleRate
                    );
                    const audioBufferSourceNode = offlineAudioContext.createBufferSource();
                    const gainNode = offlineAudioContext.createGain();

                    // Bug #5: Safari does not support copyToChannel().
                    for (let i = 0; i < 0.5 * offlineAudioContext.sampleRate; i += 1) {
                        audioBuffer.getChannelData(0)[i] = 1;
                    }

                    audioBufferSourceNode.buffer = audioBuffer;

                    gainNode.gain.setValueAtTime(-1, 0);
                    gainNode.gain.linearRampToValueAtTime(1, 0.5);

                    gainNode.gain.value = 100;

                    audioBufferSourceNode.connect(gainNode).connect(offlineAudioContext.destination);

                    audioBufferSourceNode.start();

                    offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                        // Bug #5: Safari does not support copyFromChannel().
                        const channelData = renderedBuffer.getChannelData(0);

                        for (const sample of channelData) {
                            expect(sample).to.be.at.least(-1);
                            expect(sample).to.be.at.most(1);
                        }

                        done();
                    };
                    offlineAudioContext.startRendering();
                });
            });
        });

        describe('cancelAndHoldAtTime()', () => {
            let gainNode;

            beforeEach(() => {
                gainNode = offlineAudioContext.createGain();
            });

            // bug #28

            it('should not be implemented', () => {
                expect(gainNode.gain.cancelAndHoldAtTime).to.be.undefined;
            });
        });

        describe('setValueCurveAtTime()', () => {
            // bug #152

            it('should interpolate the values incorrectly', (done) => {
                const audioBuffer = offlineAudioContext.createBuffer(1, 3, 44100);
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();
                const gainNode = offlineAudioContext.createGain();

                // Bug #5: Safari does not support copyFromChannel().
                audioBuffer.getChannelData(0).fill(1);

                audioBufferSourceNode.buffer = audioBuffer;

                // Bug #183: Safari requires the curve to be a Float32Array.
                gainNode.gain.setValueCurveAtTime(new Float32Array([1, 3]), 0, 2 / offlineAudioContext.sampleRate);

                audioBufferSourceNode.connect(gainNode).connect(offlineAudioContext.destination);

                audioBufferSourceNode.start(0);

                offlineAudioContext.oncomplete = (event) => {
                    // Bug #5: Safari does not support copyFromChannel().
                    const channelData = event.renderedBuffer.getChannelData(0);

                    expect(Array.from(channelData).slice(0, 3)).to.deep.equal([1, 3, 3]);

                    done();
                };
                offlineAudioContext.startRendering();
            });
        });
    });

    describe('createIIRFilter()', () => {
        // bug #9

        it('should not be implemented', () => {
            expect(offlineAudioContext.createIIRFilter).to.be.undefined;
        });
    });

    describe('createMediaElementSource()', () => {
        // bug #171

        it('should not throw an error', () => {
            offlineAudioContext.createMediaElementSource(new Audio());
        });
    });

    describe('createMediaStreamDestination()', () => {
        // bug #173

        it('should not throw an error', () => {
            offlineAudioContext.createMediaStreamDestination();
        });
    });

    describe('createMediaStreamSource()', () => {
        let audioContext;

        afterEach(() => audioContext.close());

        beforeEach(() => (audioContext = new webkitAudioContext())); // eslint-disable-line new-cap, no-undef

        // bug #172

        it('should not throw an error', () => {
            const mediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();

            offlineAudioContext.createMediaStreamSource(mediaStreamAudioDestinationNode.stream);
        });
    });

    describe('createScriptProcessor()', () => {
        describe('without any output channels', () => {
            // bug #87

            it('should not fire any AudioProcessingEvent', (done) => {
                const listener = spy();
                const oscillatorNode = offlineAudioContext.createOscillator();
                const scriptProcessorNode = offlineAudioContext.createScriptProcessor(256, 1, 0);

                scriptProcessorNode.onaudioprocess = listener;

                oscillatorNode.connect(scriptProcessorNode);
                oscillatorNode.start();

                offlineAudioContext.oncomplete = () => {
                    expect(listener).to.have.not.been.called;

                    done();
                };
                offlineAudioContext.startRendering();
            });
        });
    });

    describe('decodeAudioData()', () => {
        // bug #1

        it('should require the success callback function as a parameter', async function () {
            this.timeout(10000);

            const arrayBuffer = await loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav');

            expect(() => {
                offlineAudioContext.decodeAudioData(arrayBuffer);
            }).to.throw(TypeError, 'Not enough arguments');
        });

        // bug #4

        it('should throw null when asked to decode an unsupported file', function (done) {
            this.timeout(10000);

            // PNG files are not supported by any browser :-)
            loadFixtureAsArrayBuffer('one-pixel-of-transparency.png').then((arrayBuffer) => {
                offlineAudioContext.decodeAudioData(
                    arrayBuffer,
                    () => {},
                    (err) => {
                        expect(err).to.be.null;

                        done();
                    }
                );
            });
        });

        // bug #5

        it('should return an AudioBuffer without copyFromChannel() and copyToChannel() methods', function (done) {
            this.timeout(10000);

            loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav').then((arrayBuffer) => {
                offlineAudioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                    expect(audioBuffer.copyFromChannel).to.be.undefined;
                    expect(audioBuffer.copyToChannel).to.be.undefined;

                    done();
                });
            });
        });

        // bug #21

        it('should not return a promise', async function () {
            this.timeout(10000);

            const arrayBuffer = await loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav');

            expect(offlineAudioContext.decodeAudioData(arrayBuffer, () => {})).to.be.undefined;
        });

        // bug #26

        it('should throw a synchronous error', (done) => {
            try {
                offlineAudioContext.decodeAudioData(null, () => {});
            } catch (err) {
                done();
            }
        });

        // bug #43

        it('should not throw a DataCloneError', function (done) {
            this.timeout(10000);

            loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav').then((arrayBuffer) => {
                offlineAudioContext.decodeAudioData(arrayBuffer, () => {
                    offlineAudioContext.decodeAudioData(arrayBuffer, () => done());
                });
            });
        });
    });

    describe('startRendering()', () => {
        // bug #21

        it('should not return a promise', () => {
            expect(offlineAudioContext.startRendering()).to.be.undefined;
        });
    });

    describe('suspend()', () => {
        it('should throw an InvalidStateError', (done) => {
            offlineAudioContext.suspend(0.01).catch((err) => {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            });
        });
    });
});
