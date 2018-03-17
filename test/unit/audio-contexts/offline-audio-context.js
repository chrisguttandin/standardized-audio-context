import 'core-js/es7/reflect';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr
} from '../../../src/providers/unpatched-offline-audio-context-constructor';
import { OfflineAudioContext } from '../../../src/audio-contexts/offline-audio-context';
import { ReflectiveInjector } from '@angular/core';
import { WINDOW_PROVIDER } from '../../../src/providers/window';
import { loadFixture } from '../../helper/load-fixture';
import { spy } from 'sinon';

describe('OfflineAudioContext', () => {

    describe('audioWorklet', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be an instance of the AudioWorklet interface', () => {
            const audioWorklet = offlineAudioContext.audioWorklet;

            expect(audioWorklet.addModule).to.be.a('function');
        });

    });

    describe('currentTime', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a number', () => {
            expect(offlineAudioContext.currentTime).to.be.a('number');
        });

        it('should be readonly', () => {
            expect(() => {
                offlineAudioContext.currentTime = 0;
            }).to.throw(TypeError);
        });

    });

    describe('destination', () => {

        let length;
        let sampleRate;

        beforeEach(() => {
            length = 1;
            sampleRate = 44100;
        });

        it('should be an instance of the AudioDestinationNode interface', () => {
            const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });
            const destination = offlineAudioContext.destination;

            expect(destination.channelCount).to.equal(1);
            expect(destination.channelCountMode).to.equal('explicit');
            expect(destination.channelInterpretation).to.equal('speakers');
            expect(destination.maxChannelCount).to.equal(1);
            expect(destination.numberOfInputs).to.equal(1);
            expect(destination.numberOfOutputs).to.equal(0);
        });

        it('should be readonly', () => {
            const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });

            expect(() => {
                offlineAudioContext.destination = 'a fake AudioDestinationNode';
            }).to.throw(TypeError);
        });

        it('should have maxChannelCount which is at least the channelCount', () => {
            const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });
            const destination = offlineAudioContext.destination;

            expect(destination.maxChannelCount).to.be.at.least(destination.channelCount);
        });

        it('should not allow to change the value of the channelCount property', (done) => {
            const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });

            try {
                offlineAudioContext.destination.channelCount = 2;
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        it('should not allow to change the value of the channelCountMode property', (done) => {
            const offlineAudioContext = new OfflineAudioContext({ length, sampleRate });

            try {
                offlineAudioContext.destination.channelCountMode = 'max';
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        describe('with options as arguments', () => {

            let numberOfChannels;
            let offlineAudioContext;

            beforeEach(() => {
                numberOfChannels = 8;
                offlineAudioContext = new OfflineAudioContext(numberOfChannels, length, sampleRate);
            });

            it('should have a channelCount which equals the numberOfChannels', () => {
                expect(offlineAudioContext.destination.channelCount).to.equal(numberOfChannels);
            });

            it('should have a maxChannelCount which equals the numberOfChannels', () => {
                expect(offlineAudioContext.destination.maxChannelCount).to.equal(numberOfChannels);
            });

        });

        describe('with a contextOptions', () => {

            describe('without a specified value for numberOfChannels', () => {

                let offlineAudioContext;

                beforeEach(() => {
                    offlineAudioContext = new OfflineAudioContext({ length, sampleRate });
                });

                it('should have a channelCount of one', () => {
                    expect(offlineAudioContext.destination.channelCount).to.equal(1);
                });

                it('should have a maxChannelCount of one', () => {
                    expect(offlineAudioContext.destination.maxChannelCount).to.equal(1);
                });

            });

            describe('with a specified value for numberOfChannels', () => {

                let numberOfChannels;
                let offlineAudioContext;

                beforeEach(() => {
                    numberOfChannels = 8;
                    offlineAudioContext = new OfflineAudioContext({ length, numberOfChannels, sampleRate });
                });

                it('should have a channelCount which equals the numberOfChannels', () => {
                    expect(offlineAudioContext.destination.channelCount).to.equal(numberOfChannels);
                });

                it('should have a maxChannelCount which equals the numberOfChannels', () => {
                    expect(offlineAudioContext.destination.maxChannelCount).to.equal(numberOfChannels);
                });

            });

        });

    });

    describe('length', () => {

        let length;

        beforeEach(() => {
            length = 129;
        });

        it('should be readonly', () => {
            const offlineAudioContext = new OfflineAudioContext(1, length, 44100);

            expect(() => {
                offlineAudioContext.length = 128;
            }).to.throw(TypeError);
        });

        describe('with options as arguments', () => {

            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext(1, length, 44100);
            });

            it('should expose its length', () => {
                expect(offlineAudioContext.length).to.equal(length);
            });

        });

        describe('with a contextOptions', () => {

            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext({ length, sampleRate: 44100 });
            });

            it('should expose its length', () => {
                expect(offlineAudioContext.length).to.equal(length);
            });

        });

    });

    describe('oncomplete', () => {

        // @todo

    });

    describe('onstatechange', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be null', () => {
            expect(offlineAudioContext.onstatechange).to.be.null;
        });

        it('should be assignable to a function', () => {
            const fn = () => {};
            const onstatechange = offlineAudioContext.onstatechange = fn; // eslint-disable-line no-multi-assign

            expect(onstatechange).to.equal(fn);
            expect(offlineAudioContext.onstatechange).to.equal(fn);
        });

        it('should be assignable to null', () => {
            const onstatechange = offlineAudioContext.onstatechange = null; // eslint-disable-line no-multi-assign

            expect(onstatechange).to.be.null;
            expect(offlineAudioContext.onstatechange).to.be.null;
        });

        it('should not be assignable to something else', () => {
            const string = 'no function or null value';

            offlineAudioContext.onstatechange = () => {};

            const onstatechange = offlineAudioContext.onstatechange = string; // eslint-disable-line no-multi-assign

            expect(onstatechange).to.equal(string);
            expect(offlineAudioContext.onstatechange).to.be.null;
        });

    });

    describe('sampleRate', () => {

        let sampleRate;

        beforeEach(() => {
            sampleRate = 44100;
        });

        it('should be readonly', () => {
            const offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate });

            expect(() => {
                offlineAudioContext.sampleRate = 22050;
            }).to.throw(TypeError);
        });

        describe('with options as arguments', () => {

            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext(1, 1, sampleRate);
            });

            it('should expose its sampleRate', () => {
                expect(offlineAudioContext.sampleRate).to.equal(sampleRate);
            });
        });

        describe('with a contextOptions', () => {

            let offlineAudioContext;

            beforeEach(() => {
                offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate });
            });

            it('should expose its sampleRate', () => {
                expect(offlineAudioContext.sampleRate).to.equal(sampleRate);
            });

        });

    });

    describe('state', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be suspended at the beginning', () => {
            expect(offlineAudioContext.state).to.equal('suspended');
        });

        it('should be readonly', () => {
            expect(() => {
                offlineAudioContext.state = 'closed';
            }).to.throw(TypeError);
        });

        /*
         * @todo This does currently not work because of bug #49.
         * it('should be transitioned to running', (done) => {
         *     offlineAudioContext.onstatechange = () => {
         *         expect(offlineAudioContext.state).to.equal('running');
         *
         *         // Prevent consecutive calls.
         *         offlineAudioContext.onstatechange = null;
         *
         *         done();
         *     };
         *
         *     offlineAudioContext.startRendering();
         * });
         */

        it('should be closed after the buffer was rendered', () => {
            return offlineAudioContext
                .startRendering()
                .then(() => {
                    expect(offlineAudioContext.state).to.equal('closed');
                });
        });

    });

    describe('createBiquadFilter()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should return an instance of the BiquadFilterNode interface', () => {
            const biquadFilterNode = offlineAudioContext.createBiquadFilter();

            expect(biquadFilterNode.channelCount).to.equal(2);
            expect(biquadFilterNode.channelCountMode).to.equal('max');
            expect(biquadFilterNode.channelInterpretation).to.equal('speakers');

            expect(biquadFilterNode.detune.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.detune.defaultValue).to.equal(0);
            expect(biquadFilterNode.detune.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.detune.value).to.equal(0);

            expect(biquadFilterNode.frequency.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.frequency.defaultValue).to.equal(350);
            expect(biquadFilterNode.frequency.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.frequency.value).to.equal(350);

            expect(biquadFilterNode.gain.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.gain.defaultValue).to.equal(0);
            expect(biquadFilterNode.gain.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.gain.value).to.equal(0);

            expect(biquadFilterNode.getFrequencyResponse).to.be.a('function');
            expect(biquadFilterNode.numberOfInputs).to.equal(1);
            expect(biquadFilterNode.numberOfOutputs).to.equal(1);

            expect(biquadFilterNode.Q.cancelScheduledValues).to.be.a('function');
            expect(biquadFilterNode.Q.defaultValue).to.equal(1);
            expect(biquadFilterNode.Q.exponentialRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.linearRampToValueAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.setTargetAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.setValueCurveAtTime).to.be.a('function');
            expect(biquadFilterNode.Q.value).to.equal(1);

            expect(biquadFilterNode.type).to.be.a('string');
        });

        // it('should throw an error if the AudioContext is closed', () => {});

        it('should be chainable', () => {
            const biquadFilterNode = offlineAudioContext.createBiquadFilter();
            const gainNode = offlineAudioContext.createGain();

            expect(biquadFilterNode.connect(gainNode)).to.equal(gainNode);
        });

        it('should not be connectable to a node of another AudioContext', (done) => {
            const anotherOfflineAudioContext = new OfflineAudioContext(2, 129, 44100);
            const biquadFilterNode = offlineAudioContext.createBiquadFilter();

            try {
                biquadFilterNode.connect(anotherOfflineAudioContext.destination);
            } catch (err) {
                expect(err.code).to.equal(15);
                expect(err.name).to.equal('InvalidAccessError');

                done();
            }
        });

        describe('getFrequencyResponse()', () => {

            // bug #22 This is not yet implemented in Edge and Safari.

            /*
             * it('should fill the magResponse and phaseResponse arrays', () => {
             *     const biquadFilterNode = offlineAudioContext.createBiquadFilter();
             *     const magResponse = new Float32Array(5);
             *     const phaseResponse = new Float32Array(5);
             *
             *     biquadFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);
             *
             *     expect(Array.from(magResponse)).to.deep.equal([ 1.184295654296875, 0.9401244521141052, 0.2128090262413025, 0.048817940056324005, 0.011635963805019855 ]);
             *     expect(Array.from(phaseResponse)).to.deep.equal([ -0.6473332643508911, -1.862880825996399, -2.692772388458252, -2.9405176639556885, -3.044968605041504 ]);
             * });
             */

        });

    });

    describe('createBuffer()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should return an instance of the AudioBuffer interface', () => {
            const audioBuffer = offlineAudioContext.createBuffer(2, 10, 44100);

            expect(audioBuffer.duration).to.be.closeTo(10 / 44100, 0.001);
            expect(audioBuffer.length).to.equal(10);
            expect(audioBuffer.numberOfChannels).to.equal(2);
            expect(audioBuffer.sampleRate).to.equal(44100);
            expect(audioBuffer.getChannelData).to.be.a('function');
            expect(audioBuffer.copyFromChannel).to.be.a('function');
            expect(audioBuffer.copyToChannel).to.be.a('function');
        });

        it('should return an AudioBuffer which can be used with an unpatched AudioContext', () => {
            const audioBuffer = offlineAudioContext.createBuffer(2, 10, 44100);
            const injector = ReflectiveInjector.resolveAndCreate([
                UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
                WINDOW_PROVIDER
            ]);
            const UnpatchedOfflineAudioContext = injector.get(nptchdFflnDCntxtCnstrctr);
            const unpatchedOfflineAudioContext = new UnpatchedOfflineAudioContext(1, 1, 44100);
            const unpatchedAudioBufferSourceNode = unpatchedOfflineAudioContext.createBufferSource();

            unpatchedAudioBufferSourceNode.buffer = audioBuffer;
        });

        describe('copyFromChannel()', () => {

            let audioBuffer;
            let destination;

            beforeEach(() => {
                audioBuffer = offlineAudioContext.createBuffer(2, 10, 44100);
                destination = new Float32Array(10);
            });

            it('should not allow to copy a channel with a number greater or equal than the number of channels', (done) => {
                try {
                    audioBuffer.copyFromChannel(destination, 2);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

            it('should not allow to copy values with an offset greater than the length', (done) => {
                try {
                    audioBuffer.copyFromChannel(destination, 0, 10);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

        describe('copyToChannel()', () => {

            let audioBuffer;
            let source;

            beforeEach(() => {
                audioBuffer = offlineAudioContext.createBuffer(2, 10, 44100);
                source = new Float32Array(10);
            });

            it('should not allow to copy a channel with a number greater or equal than the number of channels', (done) => {
                try {
                    audioBuffer.copyToChannel(source, 2);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

            it('should not allow to copy values with an offset greater than the length', (done) => {
                try {
                    audioBuffer.copyToChannel(source, 0, 10);
                } catch (err) {
                    expect(err.code).to.equal(1);
                    expect(err.name).to.equal('IndexSizeError');

                    done();
                }
            });

        });

        describe('copyFromChannel()/copyToChannel()', () => {

            let audioBuffer;
            let destination;
            let source;

            beforeEach(() => {
                audioBuffer = offlineAudioContext.createBuffer(2, 100, 44100);
                destination = new Float32Array(10);
                source = new Float32Array(10);

                for (let i = 0; i < 10; i += 1) {
                    destination[i] = Math.random();
                    source[i] = Math.random();
                }
            });

            it('should copy values with an offset of 0', () => {
                audioBuffer.copyToChannel(source, 0);
                audioBuffer.copyFromChannel(destination, 0);

                for (let i = 0; i < 10; i += 1) {
                    expect(destination[i]).to.equal(source[i]);
                }
            });

            it('should copy values with an offset of 50', () => {
                audioBuffer.copyToChannel(source, 0, 50);
                audioBuffer.copyFromChannel(destination, 0, 50);

                for (let i = 0; i < 10; i += 1) {
                    expect(destination[i]).to.equal(source[i]);
                }
            });

            it('should copy values with an offset large enough to leave a part of the destination untouched', () => {
                const destinationCopy = Array.from(destination);

                audioBuffer.copyToChannel(source, 0, 95);
                audioBuffer.copyFromChannel(destination, 0, 95);

                for (let i = 0; i < 5; i += 1) {
                    expect(destination[i]).to.equal(source[i]);
                }

                for (let i = 5; i < 10; i += 1) {
                    expect(destination[i]).to.equal(destinationCopy[i]);
                }
            });

            it('should copy values with an offset low enough to leave a part of the buffer untouched', () => {
                audioBuffer.copyToChannel(source, 0, 35);
                audioBuffer.copyToChannel(source, 0, 25);
                audioBuffer.copyFromChannel(destination, 0, 35);

                for (let i = 0; i < 10; i += 1) {
                    expect(destination[i]).to.equal(source[i]);
                }
            });

        });

    });

    describe('createGain()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should be a function', () => {
            expect(offlineAudioContext.createGain).to.be.a('function');
        });

    });

    describe('createIIRFilter()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should return an instance of the IIRFilterNode interface', () => {
            const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

            expect(iIRFilterNode.channelCount).to.equal(2);
            expect(iIRFilterNode.channelCountMode).to.equal('max');
            expect(iIRFilterNode.channelInterpretation).to.equal('speakers');

            expect(iIRFilterNode.getFrequencyResponse).to.be.a('function');

            expect(iIRFilterNode.numberOfInputs).to.equal(1);
            expect(iIRFilterNode.numberOfOutputs).to.equal(1);
        });

        it('should throw an InvalidStateError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([ 0 ], [ 1 ]);
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        it('should throw an NotSupportedError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([], [ 1 ]);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        it('should throw an NotSupportedError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ], [ 1 ]);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        it('should throw an InvalidStateError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([ 1 ], [ 0, 1 ]);
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

        it('should throw an NotSupportedError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([ 1 ], []);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        it('should throw an NotSupportedError', (done) => {
            try {
                offlineAudioContext.createIIRFilter([ 1 ], [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ]);
            } catch (err) {
                expect(err.code).to.equal(9);
                expect(err.name).to.equal('NotSupportedError');

                done();
            }
        });

        // @todo it('should throw an error if the AudioContext is closed', () => {});

        it('should filter the given input', function (done) {
            this.timeout(10000);

            /*
             * @todo Move this in a beforeEach block.
             * Recreate an OfflineAudioContext with 2 channels.
             */
            offlineAudioContext = new OfflineAudioContext(2, 129, 44100);

            const audioBuffer = offlineAudioContext.createBuffer(2, 3, 44100);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1, -1 ], [ 1, -0.5 ]);

            audioBuffer.copyToChannel(new Float32Array([ 1, 0, 0 ]), 0);
            audioBuffer.copyToChannel(new Float32Array([ 0, 1, 1 ]), 1);

            audioBufferSourceNode.buffer = audioBuffer;

            audioBufferSourceNode.start(0);

            audioBufferSourceNode
                .connect(iIRFilterNode)
                .connect(offlineAudioContext.destination);

            offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    const leftChannelData = renderedBuffer.getChannelData(0);
                    const rightChannelData = renderedBuffer.getChannelData(1);

                    expect(leftChannelData[0]).to.equal(1);
                    expect(leftChannelData[1]).to.equal(-0.5);
                    expect(leftChannelData[2]).to.equal(-0.25);

                    expect(rightChannelData[0]).to.be.closeTo(0, 1e-37);
                    expect(rightChannelData[1]).to.equal(1);
                    expect(rightChannelData[2]).to.equal(0.5);

                    done();
                });
        });

        it('should filter another given input', function (done) {
            this.timeout(10000);

            /*
             * @todo Move this in a beforeEach block.
             * Recreate an OfflineAudioContext with 3 channels.
             */
            offlineAudioContext = new OfflineAudioContext(3, 129, 44100);

            const audioBuffer = offlineAudioContext.createBuffer(3, 3, 44100);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const iIRFilterNode = offlineAudioContext.createIIRFilter([ 0.5, -1 ], [ 1, 0.5 ]);

            audioBuffer.copyToChannel(new Float32Array([ 1, 1, 1 ]), 0);
            audioBuffer.copyToChannel(new Float32Array([ 1, 0, 0 ]), 1);
            audioBuffer.copyToChannel(new Float32Array([ 0, 1, 1 ]), 2);

            audioBufferSourceNode.buffer = audioBuffer;

            audioBufferSourceNode.start(0);

            audioBufferSourceNode
                .connect(iIRFilterNode)
                .connect(offlineAudioContext.destination);

            offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    const firstChannelData = renderedBuffer.getChannelData(0);
                    const secondChannelData = renderedBuffer.getChannelData(1);
                    const thirdChannelData = renderedBuffer.getChannelData(2);

                    expect(firstChannelData[0]).to.equal(0.5);
                    expect(firstChannelData[1]).to.equal(-0.75);
                    expect(firstChannelData[2]).to.equal(-0.125);

                    expect(secondChannelData[0]).to.equal(0.5);
                    expect(secondChannelData[1]).to.equal(-1.25);
                    expect(secondChannelData[2]).to.equal(0.625);

                    expect(thirdChannelData[0]).to.equal(0);
                    expect(thirdChannelData[1]).to.equal(0.5);
                    expect(thirdChannelData[2]).to.equal(-0.75);

                    done();
                });
        });

        it('should be chainable', () => {
            const gainNode = offlineAudioContext.createGain();
            const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1, -1 ], [ 1, -0.5 ]);

            expect(iIRFilterNode.connect(gainNode)).to.equal(gainNode);
        });

        it('should not be connectable to a node of another AudioContext', (done) => {
            const anotherOfflineAudioContext = new OfflineAudioContext(2, 129, 44100);
            const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

            try {
                iIRFilterNode.connect(anotherOfflineAudioContext.destination);
            } catch (err) {
                expect(err.code).to.equal(15);
                expect(err.name).to.equal('InvalidAccessError');

                done();
            }
        });

        describe('getFrequencyResponse()', () => {

            it('should throw an NotSupportedError', (done) => {
                const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

                try {
                    iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(0), new Float32Array(1));
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                }
            });

            it('should throw an NotSupportedError', (done) => {
                const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);

                try {
                    iIRFilterNode.getFrequencyResponse(new Float32Array([ 1 ]), new Float32Array(1), new Float32Array(0));
                } catch (err) {
                    expect(err.code).to.equal(9);
                    expect(err.name).to.equal('NotSupportedError');

                    done();
                }
            });

            it('should fill the magResponse and phaseResponse arrays', () => {
                const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1 ], [ 1 ]);
                const magResponse = new Float32Array(5);
                const phaseResponse = new Float32Array(5);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                expect(Array.from(magResponse)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                expect(Array.from(phaseResponse)).to.deep.equal([ 0, 0, 0, 0, 0 ]);
            });

            it('should fill the magResponse and phaseResponse arrays ... for some other values', () => {
                const iIRFilterNode = offlineAudioContext.createIIRFilter([ 1, -1 ], [ 1, -0.5 ]);
                const magResponse = new Float32Array(5);
                const phaseResponse = new Float32Array(5);

                iIRFilterNode.getFrequencyResponse(new Float32Array([ 200, 400, 800, 1600, 3200 ]), magResponse, phaseResponse);

                expect(Array.from(magResponse)).to.deep.equal([ 0.056942202150821686, 0.11359700560569763, 0.2249375581741333, 0.43307945132255554, 0.7616625428199768 ]);
                expect(Array.from(phaseResponse)).to.deep.equal([ 1.5280766487121582, 1.4854952096939087, 1.401282548904419, 1.2399859428405762, 0.9627721309661865 ]);
            });

        });

    });

    describe('decodeAudioData()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 1, sampleRate: 44100 });
        });

        it('should return a promise', () => {
            const promise = offlineAudioContext.decodeAudioData();

            promise.catch(() => { /* Ignore the error. */ });

            expect(promise).to.be.an.instanceOf(Promise);
        });

        describe('without a valid arrayBuffer', () => {

            it('should throw an error', (done) => {
                offlineAudioContext
                    .decodeAudioData(null)
                    .catch((err) => {
                        expect(err).to.be.an.instanceOf(TypeError);

                        done();
                    });
            });

            it('should call the errorCallback with a TypeError', (done) => {
                offlineAudioContext
                    .decodeAudioData(null, () => {}, (err) => {
                        expect(err).to.be.an.instanceOf(TypeError);

                        done();
                    })
                    .catch(() => { /* Ignore the error. */ });
            });

            // The promise is rejected before but the errorCallback gets called synchronously.
            it('should call the errorCallback before the promise gets rejected', (done) => {
                const errorCallback = spy();

                offlineAudioContext
                    .decodeAudioData(null, () => {}, errorCallback)
                    .catch(() => {
                        expect(errorCallback).to.have.been.calledOnce;

                        done();
                    });
            });

        });

        describe('with an arrayBuffer of an unsupported file', () => {

            let arrayBuffer;

            beforeEach(function (done) {
                this.timeout(5000);

                // PNG files are not supported by any browser :-)
                loadFixture('one-pixel-of-transparency.png', (err, rrBffr) => {
                    expect(err).to.be.null;

                    arrayBuffer = rrBffr;

                    done();
                });
            });

            it('should throw an error', (done) => {
                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .catch((err) => {
                        expect(err.code).to.equal(0);
                        expect(err.name).to.equal('EncodingError');

                        done();
                    });
            });

            it('should call the errorCallback with an error', (done) => {
                offlineAudioContext
                    .decodeAudioData(arrayBuffer, () => {}, (err) => {
                        expect(err.code).to.equal(0);
                        expect(err.name).to.equal('EncodingError');

                        done();
                    })
                    .catch(() => { /* Ignore the error. */ });
            });

            // The promise is rejected before but the errorCallback gets called synchronously.
            it('should call the errorCallback before the promise gets rejected', (done) => {
                const errorCallback = spy();

                offlineAudioContext
                    .decodeAudioData(arrayBuffer, () => {}, errorCallback)
                    .catch(() => {
                        expect(errorCallback).to.have.been.calledOnce;

                        done();
                    });
            });

        });

        describe('with an arrayBuffer of a supported file', function () {

            let arrayBuffer;

            beforeEach((done) => {
                this.timeout(5000);

                loadFixture('1000-frames-of-noise.wav', (err, rrBffr) => {
                    expect(err).to.be.null;

                    arrayBuffer = rrBffr;

                    done();
                });
            });

            it('should resolve to an instance of the AudioBuffer interface', () => {
                return offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then((audioBuffer) => {
                        expect(audioBuffer.duration).to.be.closeTo(1000 / 44100, 0.001);
                        expect(audioBuffer.length).to.equal(1000);
                        expect(audioBuffer.numberOfChannels).to.equal(2);
                        expect(audioBuffer.sampleRate).to.equal(44100);

                        expect(audioBuffer.getChannelData).to.be.a('function');
                        expect(audioBuffer.copyFromChannel).to.be.a('function');
                        expect(audioBuffer.copyToChannel).to.be.a('function');
                    });
            });

            it('should call the successCallback with an instance of the AudioBuffer interface', (done) => {
                offlineAudioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                    expect(audioBuffer.duration).to.be.closeTo(1000 / 44100, 0.001);
                    expect(audioBuffer.length).to.equal(1000);
                    expect(audioBuffer.numberOfChannels).to.equal(2);
                    expect(audioBuffer.sampleRate).to.equal(44100);

                    expect(audioBuffer.getChannelData).to.be.a('function');
                    expect(audioBuffer.copyFromChannel).to.be.a('function');
                    expect(audioBuffer.copyToChannel).to.be.a('function');

                    done();
                });
            });

            // The promise is resolved before but the successCallback gets called synchronously.
            it('should call the successCallback before the promise gets resolved', () => {
                const successCallback = spy();

                return offlineAudioContext
                    .decodeAudioData(arrayBuffer, successCallback)
                    .then(() => {
                        expect(successCallback).to.have.been.calledOnce;
                    });
            });

            it('should throw a DataCloneError', (done) => {
                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then(() => offlineAudioContext.decodeAudioData(arrayBuffer))
                    .catch((err) => {
                        expect(err.code).to.equal(25);
                        expect(err.name).to.equal('DataCloneError');

                        done();
                    });
            });

            it('should neuter the arrayBuffer', (done) => {
                offlineAudioContext.decodeAudioData(arrayBuffer);

                setTimeout(() => {
                    expect(() => {
                        // Firefox will throw an error when using a neutered ArrayBuffer.
                        const uint8Array = new Uint8Array(arrayBuffer);

                        // Chrome, Opera and Safari will throw an error when trying to convert a typed array with a neutered ArrayBuffer.
                        Array.from(uint8Array);
                    }).to.throw(Error);

                    done();
                });
            });

            it('should resolve with a assignable AudioBuffer', () => {
                return offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then((audioBuffer) => {
                        const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                        audioBufferSourceNode.buffer = audioBuffer;
                    });
            });

            it('should allow to encode in parallel', function () {
                this.timeout(10000);

                const arrayBufferCopies = [];

                for (let i = 1; i < 100; i += 1) {
                    arrayBufferCopies.push(arrayBuffer.slice(0));
                }

                return Promise
                    .all(arrayBufferCopies.map((rrBffr) => offlineAudioContext.decodeAudioData(rrBffr)));
            });

        });

    });

    describe('startRendering()', () => {

        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext({ length: 10, sampleRate: 44100 });
        });

        it('should return a promise', () => {
            expect(offlineAudioContext.startRendering()).to.be.an.instanceOf(Promise);
        });

        it('should resolve with the renderedBuffer', () => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 10, 44100);
            const buffer = new Float32Array(10);
            const bufferSourceNode = offlineAudioContext.createBufferSource(offlineAudioContext);

            for (let i = 0; i < buffer.length; i += 1) {
                buffer[i] = i;
            }

            audioBuffer.copyToChannel(buffer, 0, 0);

            bufferSourceNode.buffer = audioBuffer;

            bufferSourceNode.connect(offlineAudioContext.destination);

            bufferSourceNode.start(0);

            return offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    expect(renderedBuffer.length).to.equal(audioBuffer.length);

                    // @todo Use copyFromChannel() when possible.
                    const channelData = renderedBuffer.getChannelData(0);

                    for (let i = 0; i < audioBuffer.length; i += 1) {
                        expect(channelData[i]).to.equal(i);
                    }
                });
        });

        it('should resolve to an instance of the AudioBuffer interface', () => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 10, 44100);
            const buffer = new Float32Array(10);
            const bufferSourceNode = offlineAudioContext.createBufferSource(offlineAudioContext);

            for (let i = 0; i < buffer.length; i += 1) {
                buffer[i] = i;
            }

            audioBuffer.copyToChannel(buffer, 0, 0);

            bufferSourceNode.buffer = audioBuffer;

            bufferSourceNode.connect(offlineAudioContext.destination);

            bufferSourceNode.start(0);

            return offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    expect(renderedBuffer.duration).to.be.closeTo(10 / 44100, 0.001);
                    expect(renderedBuffer.length).to.equal(10);
                    expect(renderedBuffer.numberOfChannels).to.equal(1);
                    expect(renderedBuffer.sampleRate).to.equal(44100);

                    expect(renderedBuffer.getChannelData).to.be.a('function');
                    expect(renderedBuffer.copyFromChannel).to.be.a('function');
                    expect(renderedBuffer.copyToChannel).to.be.a('function');
                });
        });

    });

    /*
     * describe('suspend()', () => {
     *
     *     it('should suspend the render process at the render quantum', (done) => {
     *         offlineAudioContext
     *             .suspend(Math.floor(Math.random() * 128) / offlineAudioContext.sampleRate)
     *             .then(() => {
     *                 expect(offlineAudioContext.currentTime).to.equal(0);
     *
     *                 offlineAudioContext.resume();
     *
     *                 done();
     *             });
     *
     *         offlineAudioContext.startRendering();
     *     });
     *
     *     it('should not allow to suspend the render process more than once at the render quantum', (done) => {
     *         offlineAudioContext
     *             .suspend(Math.floor(Math.random() * 128) / offlineAudioContext.sampleRate)
     *             .then(() => offlineAudioContext.resume());
     *
     *         offlineAudioContext
     *             .suspend(Math.floor(Math.random() * 128) / offlineAudioContext.sampleRate)
     *             .catch((err) => {
     *                 expect(err.code).to.equal(11);
     *                 expect(err.name).to.equal('InvalidStateError');
     *
     *                 done();
     *             });
     *
     *         offlineAudioContext.startRendering();
     *     });
     *
     * });
     */

});
