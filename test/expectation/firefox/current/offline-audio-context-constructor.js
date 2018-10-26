import { loadFixture } from '../../../helper/load-fixture';

describe('offlineAudioContextConstructor', () => {

    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('createBufferSource()', () => {

        let audioBufferSourceNode;

        beforeEach(() => {
            audioBufferSourceNode = offlineAudioContext.createBufferSource();
        });

        describe('start()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                expect(() => audioBufferSourceNode.start(-1)).to.throw(DOMException);

                expect(() => audioBufferSourceNode.start(0, -1)).to.throw(DOMException);

                expect(() => audioBufferSourceNode.start(0, 0, -1)).to.throw(DOMException);
            });

        });

        describe('stop()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                expect(() => audioBufferSourceNode.stop(-1)).to.throw(DOMException);
            });

        });

    });

    describe('createConstantSource()', () => {

        let constantSourceNode;

        beforeEach(() => {
            constantSourceNode = offlineAudioContext.createConstantSource();
        });

        describe('start()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                expect(() => constantSourceNode.start(-1)).to.throw(DOMException);
            });

        });

        describe('stop()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                expect(() => constantSourceNode.stop(-1)).to.throw(DOMException);
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
