import { spy } from 'sinon';

describe('audioContextConstructor', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('audioWorklet', () => {

        // bug #59

        it('should not be implemented', () => {
            expect(audioContext.audioWorklet).to.be.undefined;
        });

    });

    describe('outputLatency', () => {

        // bug #40

        it('should not be implemented', () => {
            expect(audioContext.outputLatency).to.be.undefined;
        });

    });

    describe('state', () => {

        // bug #34

        it('should be set to running right away', () => {
            expect(audioContext.state).to.equal('running');
        });

    });

    describe('createBiquadFilter()', () => {

        describe('getFrequencyResponse()', () => {

            // bug #68

            it('should throw no error', () => {
                const biquadFilterNode = audioContext.createBiquadFilter();

                biquadFilterNode.getFrequencyResponse(new Float32Array(), new Float32Array(1), new Float32Array(1));
            });

        });

    });

    describe('createBufferSource()', () => {

        describe('stop()', () => {

            // bug #44

            it('should throw a DOMException', () => {
                const bufferSourceNode = audioContext.createBufferSource();

                expect(() => bufferSourceNode.stop(-1)).to.throw(DOMException);
            });

        });

    });

    describe('createChannelSplitter()', () => {

        // bug #30

        it('should allow to set the channelCountMode', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            channelSplitterNode.channelCountMode = 'explicit';
        });

        // bug #32

        it('should allow to set the channelInterpretation', () => {
            const channelSplitterNode = audioContext.createChannelSplitter();

            channelSplitterNode.channelInterpretation = 'discrete';
        });

    });

    describe('decodeAudioData()', () => {

        // bug #6

        it('should not call the errorCallback at all', (done) => {
            const errorCallback = spy();

            audioContext.decodeAudioData(null, () => {}, errorCallback);

            setTimeout(() => {
                expect(errorCallback).to.have.not.been.called;

                done();
            }, 1000);
        });

    });

});
