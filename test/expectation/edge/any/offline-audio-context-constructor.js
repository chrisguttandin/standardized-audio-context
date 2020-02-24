import { spy } from 'sinon';

describe('offlineAudioContextConstructor', () => {

    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('destination', () => {

        // bug #52

        it('should allow to change the value of the channelCount property', () => {
            offlineAudioContext.destination.channelCount = 2;
        });

        // bug #53

        it('should allow to change the value of the channelCountMode property', () => {
            offlineAudioContext.destination.channelCountMode = 'max';
        });

    });

    describe('createBufferSource()', () => {

        // bug #14

        it('should not resample an oversampled AudioBuffer', (done) => {
            const audioBuffer = offlineAudioContext.createBuffer(1, 8, 88200);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const eightRandomValues = [];

            for (let i = 0; i < 8; i += 1) {
                eightRandomValues[i] = (Math.random() * 2) - 1;
            }

            audioBuffer.copyToChannel(new Float32Array(eightRandomValues), 0);

            audioBufferSourceNode.buffer = audioBuffer;
            audioBufferSourceNode.start(0);
            audioBufferSourceNode.connect(offlineAudioContext.destination);

            offlineAudioContext
                .startRendering()
                .then((buffer) => {
                    const channelData = new Float32Array(4);

                    buffer.copyFromChannel(channelData, 0);

                    expect(channelData[0]).to.be.closeTo(eightRandomValues[0], 0.0000001);
                    expect(channelData[1]).to.be.closeTo(eightRandomValues[2], 0.0000001);
                    expect(channelData[2]).to.be.closeTo(eightRandomValues[4], 0.0000001);
                    expect(channelData[3]).to.be.closeTo(eightRandomValues[6], 0.0000001);

                    done();
                });
        });

        // bug #164

        it('should not mute cycles', function () {
            this.timeout(20000);

            const audioBuffer = offlineAudioContext.createBuffer(1, offlineAudioContext.length, offlineAudioContext.sampleRate);
            const audioBufferSourceNode = offlineAudioContext.createBufferSource();
            const gainNode = offlineAudioContext.createGain();

            for (let i = 0; i < offlineAudioContext.length; i += 1) {
                audioBuffer.getChannelData(0)[i] = 1;
            }

            audioBufferSourceNode.buffer = audioBuffer;

            audioBufferSourceNode
                .connect(gainNode)
                .connect(offlineAudioContext.destination);

            gainNode.connect(gainNode);

            audioBufferSourceNode.start(0);

            return offlineAudioContext
                .startRendering()
                .then((renderedBuffer) => {
                    const channelData = new Float32Array(renderedBuffer.length);

                    renderedBuffer.copyFromChannel(channelData, 0);

                    for (const sample of channelData) {
                        expect(sample).to.not.equal(0);
                    }
                });
        });

        describe('start()', () => {

            // bug #92

            it('should not respect a specified duration', () => {
                const audioBuffer = offlineAudioContext.createBuffer(1, 4, 88200);
                const audioBufferSourceNode = offlineAudioContext.createBufferSource();

                audioBuffer.copyToChannel(new Float32Array([ 1, 1, 1, 1 ]), 0);

                audioBufferSourceNode.buffer = audioBuffer;
                audioBufferSourceNode.start(0, 0, (2 / offlineAudioContext.sampleRate));
                audioBufferSourceNode.connect(offlineAudioContext.destination);

                return offlineAudioContext
                    .startRendering()
                    .then((buffer) => {
                        const channelData = new Float32Array(4);

                        buffer.copyFromChannel(channelData, 0);

                        expect(Array.from(channelData)).to.deep.equal([ 1, 1, 0, 0 ]);
                    });
            });

        });

    });

    describe('createScriptProcessor()', () => {

        describe('without any output channels', () => {

            // bug #87

            it('should not fire any AudioProcessingEvent', () => {
                const listener = spy();
                const oscillatorNode = offlineAudioContext.createOscillator();
                const scriptProcessorNode = offlineAudioContext.createScriptProcessor(256, 1, 0);

                scriptProcessorNode.onaudioprocess = listener;

                oscillatorNode.connect(scriptProcessorNode);
                oscillatorNode.start();

                return offlineAudioContext
                    .startRendering()
                    .then(() => {
                        expect(listener).to.have.not.been.called;
                    });
            });

        });

    });

    describe('startRendering()', () => {

        // bug #158

        it('should not advance currentTime', () => {
            offlineAudioContext
                .startRendering()
                .then(() => {
                    expect(offlineAudioContext.currentTime).to.equal(0);
                });
        });

    });

});
