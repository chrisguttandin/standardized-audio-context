import { spy } from 'sinon';

describe('AudioWorklet', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    describe('without any connected inputs', () => {
        // bug #170

        it('should call process() with an array with empty channelData for each input', function (done) {
            this.timeout(10000);

            offlineAudioContext.audioWorklet.addModule('base/test/fixtures/inspector-processor.js').then(() => {
                const audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'inspector-processor');

                audioWorkletNode.connect(offlineAudioContext.destination);

                audioWorkletNode.port.onmessage = ({ data }) => {
                    audioWorkletNode.port.onmessage = null;

                    expect(data.inputs.length).to.equal(1);
                    expect(data.inputs[0].length).to.equal(1);
                    expect(data.inputs[0][0].length).to.equal(0);

                    done();
                };

                offlineAudioContext.startRendering();
            });
        });
    });

    describe('without specified maxValue and minValue values', () => {
        // bug #82

        it('should be 3.402820018375656e+38 and -3.402820018375656e+38', async function () {
            this.timeout(10000);

            await offlineAudioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');

            const audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'gain-processor');

            expect(audioWorkletNode.parameters.get('gain').maxValue).to.equal(3.402820018375656e38);
            expect(audioWorkletNode.parameters.get('gain').minValue).to.equal(-3.402820018375656e38);
        });
    });

    describe('without any connected outputs', () => {
        // bug #86

        it('should not call process()', function (done) {
            this.timeout(10000);

            offlineAudioContext.audioWorklet.addModule('base/test/fixtures/inspector-processor.js').then(() => {
                const audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'inspector-processor');
                const constantSourceNode = new ConstantSourceNode(offlineAudioContext);
                const listener = spy();

                audioWorkletNode.port.onmessage = listener;

                constantSourceNode.connect(audioWorkletNode);
                constantSourceNode.start();

                setTimeout(() => {
                    expect(listener).to.have.not.been.called;

                    done();
                }, 500);

                offlineAudioContext.startRendering();
            });
        });
    });

    describe('with a failing processor', () => {
        beforeEach(async function () {
            this.timeout(10000);

            await offlineAudioContext.audioWorklet.addModule('base/test/fixtures/failing-processor.js');
        });

        // bug #156

        it('should fire a regular event', function (done) {
            this.timeout(10000);

            const audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'failing-processor');

            audioWorkletNode.onprocessorerror = function (event) {
                expect(event).to.be.not.an.instanceOf(ErrorEvent);

                done();
            };

            audioWorkletNode.connect(offlineAudioContext.destination);

            offlineAudioContext.startRendering();
        });
    });
});
