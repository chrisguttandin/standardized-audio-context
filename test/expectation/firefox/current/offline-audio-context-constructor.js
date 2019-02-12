import { loadFixture } from '../../../helper/load-fixture';

describe('offlineAudioContextConstructor', () => {

    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('decodeAudioData()', () => {

        // bug #43

        it('should not throw a DataCloneError', function (done) {
            this.timeout(10000);

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
