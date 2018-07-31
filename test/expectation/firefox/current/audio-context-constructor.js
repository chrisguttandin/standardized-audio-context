import { loadFixture } from '../../../helper/load-fixture';

describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('createBufferSource()', () => {

        describe('start()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const bufferSourceNode = audioContext.createBufferSource();

                expect(() => bufferSourceNode.start(-1)).to.throw(DOMException);

                expect(() => bufferSourceNode.start(0, -1)).to.throw(DOMException);

                expect(() => bufferSourceNode.start(0, 0, -1)).to.throw(DOMException);
            });

        });

    });

    describe('createChannelSplitter()', () => {

        // bug #90

        it('should have a channelCount of 2', () => {
            const channelSplitterNode = audioContext.createChannelSplitter(4);

            expect(channelSplitterNode.channelCount).to.equal(2);
        });

        // bug #29

        it('should have a channelCountMode of max', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelCountMode).to.equal('max');
        });

        // bug #31

        it('should have a channelInterpretation of speakers', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            expect(channelSplitterNode.channelInterpretation).to.equal('speakers');
        });

    });

    describe('decodeAudioData()', () => {

        // bug #43

        it('should not throw a DataCloneError', (done) => {
            loadFixture('1000-frames-of-noise.wav', (err, arrayBuffer) => {
                expect(err).to.be.null;

                audioContext
                    .decodeAudioData(arrayBuffer)
                    .then(() => audioContext.decodeAudioData(arrayBuffer))
                    .catch((rr) => {
                        expect(rr.code).to.not.equal(25);
                        expect(rr.name).to.not.equal('DataCloneError');

                        done();
                    });
            });
        });

    });

});
