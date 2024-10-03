import { loadFixtureAsArrayBuffer } from '../../../helper/load-fixture';
import { stub } from 'sinon';

describe('offlineAudioContextConstructor', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new webkitOfflineAudioContext(1, 25600, 44100); // eslint-disable-line new-cap, no-undef
    });

    it('should not provide an unprefixed constructor', () => {
        expect(window.OfflineAudioContext).to.be.undefined;
    });

    describe('destination', () => {
        // bug #132

        it('should have a wrong channelCount property', () => {
            expect(offlineAudioContext.destination.channelCount).to.equal(2);
        });

        // bug #83

        it('should have a channelCountMode of max', () => {
            expect(offlineAudioContext.destination.channelCountMode).to.equal('max');
        });

        // bug #47

        it('should not have a maxChannelCount property', () => {
            expect(offlineAudioContext.destination.maxChannelCount).to.equal(0);
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

    describe('createBufferSource()', () => {
        describe('buffer', () => {
            // bug #95

            it('should not play a buffer with only one sample', (done) => {
                const audioBuffer = offlineAudioContext.createBuffer(1, 1, 44100);
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBuffer.getChannelData(0)[0] = 1;

                audioBufferSourceNode.buffer = audioBuffer;

                audioBufferSourceNode.connect(offlineAudioContext.destination);
                audioBufferSourceNode.start();

                offlineAudioContext.oncomplete = (event) => {
                    const channelData = event.renderedBuffer.getChannelData(0);

                    expect(channelData[0]).to.equal(0);

                    audioBufferSourceNode.disconnect(offlineAudioContext.destination);

                    done();
                };
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

            // bug #69

            it('should not ignore calls repeated calls to start()', () => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBufferSourceNode.start();
                audioBufferSourceNode.start();
            });
        });
    });

    describe('createGain()', () => {
        describe('gain', () => {
            describe('setValueCurveAtTime()', () => {
                // bug #152

                it('should interpolate the values incorrectly', (done) => {
                    const audioBuffer = offlineAudioContext.createBuffer(1, 3, 44100);
                    const audioBufferSourceNode = offlineAudioContext.createBufferSource();
                    const gainNode = offlineAudioContext.createGain();

                    // Bug #5: Safari does not support copyFromChannel().
                    audioBuffer.getChannelData(0).fill(1);

                    audioBufferSourceNode.buffer = audioBuffer;

                    gainNode.gain.setValueCurveAtTime([1, 3], 0, 2 / offlineAudioContext.sampleRate);

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
    });

    describe('createScriptProcessor()', () => {
        // bug #8

        it('should not fire onaudioprocess for every buffer', (done) => {
            const scriptProcessorNode = offlineAudioContext.createScriptProcessor(256, 1, 1);

            scriptProcessorNode.connect(offlineAudioContext.destination);
            scriptProcessorNode.onaudioprocess = stub();

            offlineAudioContext.oncomplete = () => {
                expect(scriptProcessorNode.onaudioprocess.callCount).to.be.below(100);

                done();
            };
            offlineAudioContext.startRendering();
        });

        // bug #13

        it('should not have any output', (done) => {
            const scriptProcessorNode = offlineAudioContext.createScriptProcessor(256, 1, 1);

            scriptProcessorNode.connect(offlineAudioContext.destination);

            let numberOfInvocations = 0;

            scriptProcessorNode.onaudioprocess = (event) => {
                numberOfInvocations += 1;

                // Bug #5: Safari does not support copyFromChannel().
                const channelData = event.outputBuffer.getChannelData(0);

                channelData.fill(1);
            };

            offlineAudioContext.oncomplete = (event) => {
                // Bug #5: Safari does not support copyFromChannel().
                const channelData = event.renderedBuffer.getChannelData(0);

                expect(Array.from(channelData)).to.not.contain(1);

                expect(numberOfInvocations).to.be.above(0);

                done();
            };
            offlineAudioContext.startRendering();
        });
    });

    describe('createWaveShaper()', () => {
        // bug #119

        it('should map the values incorrectly', (done) => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 5, offlineAudioContext.sampleRate);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const waveShaperNode = offlineAudioContext.createWaveShaper();

            audioBufferSourceNode.buffer = audioBuffer;

            waveShaperNode.curve = new Float32Array([1, 0.5, 0]);

            audioBufferSourceNode.connect(waveShaperNode).connect(offlineAudioContext.destination);

            audioBufferSourceNode.start(0);

            offlineAudioContext.oncomplete = ({ renderedBuffer }) => {
                expect(renderedBuffer.getChannelData(0)[0]).to.equal(0.25);

                done();
            };
            offlineAudioContext.startRendering();
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
