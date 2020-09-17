describe('audioContextConstructor', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    describe('without a constructed AudioContext', () => {
        describe('with four running AudioContexts', () => {
            let audioContexts;
            let gainNodes;

            afterEach(() => {
                [audioContext, ...audioContexts].forEach((dCntxt, index) => gainNodes[index].disconnect(dCntxt.destination));

                return Promise.all(audioContexts.map((dCntxt) => dCntxt.close()));
            });

            beforeEach(() => {
                audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
                audioContexts = [new webkitAudioContext(), new webkitAudioContext(), new webkitAudioContext()]; // eslint-disable-line new-cap, no-undef

                gainNodes = [audioContext, ...audioContexts].map((dCntxt) => {
                    const gainNode = dCntxt.createGain();

                    gainNode.connect(dCntxt.destination);

                    return gainNode;
                });
            });

            // bug #131

            it('should not allow to create another AudioContext', () => {
                expect(new webkitAudioContext()).to.be.null; // eslint-disable-line new-cap, no-undef
            });
        });
    });

    describe('with a constructed AudioContext', () => {
        beforeEach(() => {
            audioContext = new webkitAudioContext(); // eslint-disable-line new-cap, no-undef
        });

        describe('createBuffer()', () => {
            describe('getChannelData()', () => {
                let audioBuffer;

                beforeEach(() => {
                    audioBuffer = audioContext.createBuffer(2, 10, 44100);
                });

                describe('with an index of an unexisting channel', () => {
                    // bug #100

                    it('should throw a SyntaxError', (done) => {
                        try {
                            audioBuffer.getChannelData(2);
                        } catch (err) {
                            expect(err.code).to.equal(12);
                            expect(err.name).to.equal('SyntaxError');

                            done();
                        }
                    });
                });
            });
        });

        describe('createChannelMerger()', () => {
            // bug #15

            it('should have a wrong channelCount', () => {
                const channelMergerNode = audioContext.createChannelMerger();

                expect(channelMergerNode.channelCount).to.not.equal(1);
            });

            it('should have a wrong channelCountMode', () => {
                const channelMergerNode = audioContext.createChannelMerger();

                expect(channelMergerNode.channelCountMode).to.not.equal('explicit');
            });

            // bug #16

            it('should allow to set the channelCountMode', () => {
                const channelMergerNode = audioContext.createChannelMerger();

                channelMergerNode.channelCountMode = 'clamped-max';
            });
        });

        describe('createChannelSplitter()', () => {
            // bug #96

            it('should have a wrong channelCount', () => {
                const channelSplitterNode = audioContext.createChannelSplitter(6);

                expect(channelSplitterNode.channelCount).to.equal(2);
            });

            // bug #97

            it('should allow to set the channelCount', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                channelSplitterNode.channelCount = 6;
                channelSplitterNode.channelCount = 2;
            });

            // bug #29

            it('should have a wrong channelCountMode', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                expect(channelSplitterNode.channelCountMode).to.equal('max');
            });

            // bug #30

            it('should allow to set the channelCountMode', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                channelSplitterNode.channelCountMode = 'explicit';
                channelSplitterNode.channelCountMode = 'max';
            });

            // bug #31

            it('should have a wrong channelInterpretation', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
            });

            // bug #32

            it('should allow to set the channelInterpretation', () => {
                const channelSplitterNode = audioContext.createChannelSplitter();

                channelSplitterNode.channelInterpretation = 'discrete';
                channelSplitterNode.channelInterpretation = 'speakers';
            });
        });

        describe('createMediaStreamSource()', () => {
            // bug #165

            it('output silence after being disconnected', function (done) {
                this.timeout(10000);

                const mediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();
                const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStreamAudioDestinationNode.stream);
                const oscillatorNode = audioContext.createOscillator();
                const scriptProcessorNode = audioContext.createScriptProcessor(256, 1, 1);

                oscillatorNode.connect(mediaStreamAudioDestinationNode);
                mediaStreamAudioSourceNode.connect(scriptProcessorNode).connect(audioContext.destination);

                oscillatorNode.start();

                setTimeout(() => {
                    mediaStreamAudioSourceNode.disconnect(scriptProcessorNode);

                    setTimeout(() => {
                        mediaStreamAudioSourceNode.connect(scriptProcessorNode);

                        scriptProcessorNode.onaudioprocess = (event) => {
                            const channelData = event.inputBuffer.getChannelData(0);

                            if (Array.prototype.some.call(channelData, (sample) => sample !== 0)) {
                                done(new Error('This should never be called.'));
                            }
                        };

                        setTimeout(() => {
                            oscillatorNode.stop();

                            scriptProcessorNode.onaudioprocess = null;

                            oscillatorNode.disconnect(mediaStreamAudioDestinationNode);
                            mediaStreamAudioSourceNode.disconnect(scriptProcessorNode);
                            scriptProcessorNode.disconnect(audioContext.destination);

                            done();
                        }, 2000);
                    }, 2000);
                }, 500);
            });
        });

        describe('createOscillator()', () => {
            describe('detune', () => {
                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = audioContext.createOscillator();
                });

                describe('maxValue', () => {
                    // bug #81

                    it('should be 4800', () => {
                        expect(oscillatorNode.detune.maxValue).to.equal(4800);
                    });
                });

                describe('minValue', () => {
                    // bug #81

                    it('should be -4800', () => {
                        expect(oscillatorNode.detune.minValue).to.equal(-4800);
                    });
                });
            });

            describe('frequency', () => {
                let oscillatorNode;

                beforeEach(() => {
                    oscillatorNode = audioContext.createOscillator();
                });

                describe('maxValue', () => {
                    // bug #76

                    it('should be 100000', () => {
                        expect(oscillatorNode.frequency.maxValue).to.equal(100000);
                    });
                });

                describe('minValue', () => {
                    // bug #76

                    it('should be 0', () => {
                        expect(oscillatorNode.frequency.minValue).to.equal(0);
                    });
                });
            });
        });

        describe('createWaveShaper()', () => {
            let waveShaperNode;

            beforeEach(() => {
                waveShaperNode = audioContext.createWaveShaper();
            });

            describe('curve', () => {
                // bug #102

                it('should allow to assign a curve with less than two samples', () => {
                    waveShaperNode.curve = new Float32Array([1]);
                });

                // bug #103

                it('should not allow to assign null', () => {
                    expect(() => {
                        waveShaperNode.curve = null;
                    }).to.throw(TypeError, 'The WaveShaperNode.curve attribute must be an instance of Float32Array');
                });
            });
        });
    });
});
