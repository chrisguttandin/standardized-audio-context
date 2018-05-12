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
                const bufferSourceNode = offlineAudioContext.createBufferSource();

                expect(() => bufferSourceNode.start(-1)).to.throw(DOMException);

                // A negative offset does not throw anything.
                bufferSourceNode.start(0, -1);

                expect(() => bufferSourceNode.start(0, 0, -1)).to.throw(DOMException);
            });

        });

    });

    describe('createChannelSplitter()', () => {

        // bug #30

        it('should allow to set the channelCountMode', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            channelSplitterNode.channelCountMode = 'explicit';
        });

        // bug #32

        it('should allow to set the channelInterpretation', () => {
            const channelSplitterNode = offlineAudioContext.createChannelSplitter();

            channelSplitterNode.channelInterpretation = 'discrete';
        });

    });

    describe('createConstantSource()', () => {

        describe('channelCount', () => {

            // bug #67

            it('should have a channelCount of 1', () => {
                const constantSourceNode = offlineAudioContext.createConstantSource();

                expect(constantSourceNode.channelCount).to.equal(1);
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
                    .catch((err) => {
                        expect(err.code).to.not.equal(25);
                        expect(err.name).to.not.equal('DataCloneError');

                        done();
                    });
            });
        });

    });

});
