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

    describe('createChannelSplitter()', () => {

        // bug #90

        it('should have a channelCount of 2', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter(4);

            expect(channelSplitterNode.channelCount).to.equal(2);
        });

        // bug #29

        it('should have a channelCountMode of max', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            expect(channelSplitterNode.channelCountMode).to.equal('max');
        });

        // bug #31

        it('should have a channelInterpretation of speakers', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
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
                    .catch((rr) => {
                        expect(rr.code).to.not.equal(25);
                        expect(rr.name).to.not.equal('DataCloneError');

                        done();
                    });
            });
        });

    });

});
