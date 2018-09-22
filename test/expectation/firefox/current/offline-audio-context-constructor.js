import { loadFixture } from '../../../helper/load-fixture';

describe('offlineAudioContextConstructor', () => {

    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('createBufferSource()', () => {

        describe('start()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                expect(() => audioBufferSourceNode.start(-1)).to.throw(DOMException);

                expect(() => audioBufferSourceNode.start(0, -1)).to.throw(DOMException);

                expect(() => audioBufferSourceNode.start(0, 0, -1)).to.throw(DOMException);
            });

        });

    });

    describe('createConstantSource()', () => {

        describe('start()', () => {

            // bug #70

            it('should start it with a maximum accurary of 128 samples', () => {
                const constantSourceNode = offlineAudioContext.createConstantSource();

                constantSourceNode.connect(offlineAudioContext.destination);
                constantSourceNode.start(127 / offlineAudioContext.sampleRate);

                return offlineAudioContext
                    .startRendering()
                    .then((buffer) => {
                        const channelData = new Float32Array(5);

                        buffer.copyFromChannel(channelData, 0, 0);

                        expect(Array.from(channelData)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                    });
            });

        });

        describe('stop()', () => {

            // bug #70

            it('should stop it with a maximum accurary of 128 samples', () => {
                const constantSourceNode = offlineAudioContext.createConstantSource();

                constantSourceNode.connect(offlineAudioContext.destination);
                constantSourceNode.start();
                constantSourceNode.stop(1 / offlineAudioContext.sampleRate);

                return offlineAudioContext
                    .startRendering()
                    .then((buffer) => {
                        const channelData = new Float32Array(5);

                        buffer.copyFromChannel(channelData, 0, 0);

                        expect(Array.from(channelData)).to.deep.equal([ 1, 1, 1, 1, 1 ]);
                    });
            });

        });

    });

    describe('decodeAudioData()', () => {

        // bug #43

        it('should not throw a DataCloneError', (done) => {
            loadFixture('1000-frames-of-noise.wav', (err, arrayBuffer) => {
                expect(err).to.be.null;

                offlineAudioContext
                    .decodeAudioData(arrayBuffer)
                    .then(() => offlineAudioContext.decodeAudioData(arrayBuffer))
                    .catch((err2) => {
                        expect(err2.code).to.not.equal(25);
                        expect(err2.name).to.not.equal('DataCloneError');

                        done();
                    });
            });
        });

    });

});
