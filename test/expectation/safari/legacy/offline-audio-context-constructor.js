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
