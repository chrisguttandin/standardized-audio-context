import { spy } from 'sinon';

describe('AudioWorklet', () => {

    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => {
        audioContext = new AudioContext();
    });

    describe('with an unknown module', () => {

        // bug #60

        it('should throw an InvalidStateError', (done) => {
            try {
                new AudioWorkletNode(audioContext, 'unknown-processor');
            } catch (err) {
                expect(err.code).to.equal(11);
                expect(err.name).to.equal('InvalidStateError');

                done();
            }
        });

    });

    describe('with processorOptions set to null', () => {

        // bug #66

        it('should throw a TypeError', async () => {
            await audioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');

            expect(() => {
                new AudioWorkletNode(audioContext, 'gain-processor', { processorOptions: null });
            }).to.throw(TypeError, "Failed to construct 'AudioWorkletNode': member processorOptions is not an object.");
        });

    });

    describe('without specified maxValue and minValue values', () => {

        // bug #82

        it('should be 3.402820018375656e+38 and -3.402820018375656e+38', async () => {
            await audioContext.audioWorklet.addModule('base/test/fixtures/gain-processor.js');

            const audioWorkletNode = new AudioWorkletNode(audioContext, 'gain-processor');

            expect(audioWorkletNode.parameters.get('gain').maxValue).to.equal(3.402820018375656e+38);
            expect(audioWorkletNode.parameters.get('gain').minValue).to.equal(-3.402820018375656e+38);
        });

    });

    describe('without any automation', () => {

        // bug #85

        it('should call process() with the full array of values for each parameter', (done) => {
            audioContext.audioWorklet
                .addModule('base/test/fixtures/inspector-processor.js')
                .then(() => {
                    const audioWorkletNode = new AudioWorkletNode(audioContext, 'inspector-processor');
                    const values = new Array(128);

                    values.fill(1);

                    audioWorkletNode.port.onmessage = ({ data }) => {
                        audioWorkletNode.port.onmessage = null;

                        expect(Array.from(data.parameters.gain)).to.deep.equal(values);

                        done();
                    };

                    audioWorkletNode.connect(audioContext.destination);
                });
        });

    });

    describe('without any connected inputs', () => {

        // bug #88

        it('should call process() with an nonempty array for each input', (done) => {
            audioContext.audioWorklet
                .addModule('base/test/fixtures/inspector-processor.js')
                .then(() => {
                    const audioWorkletNode = new AudioWorkletNode(audioContext, 'inspector-processor');

                    audioWorkletNode.port.onmessage = ({ data }) => {
                        if (data.inputs !== undefined) {
                            audioWorkletNode.port.onmessage = null;

                            expect(data.inputs[0].length).to.not.equal(0);

                            done();
                        }
                    };

                    audioWorkletNode.connect(audioContext.destination);
                });
        });

    });

    describe('without any connected outputs', () => {

        // bug #86

        it('should not call process()', (done) => {
            audioContext.audioWorklet
                .addModule('base/test/fixtures/inspector-processor.js')
                .then(() => {
                    const audioWorkletNode = new AudioWorkletNode(audioContext, 'inspector-processor');
                    const constantSourceNode = new ConstantSourceNode(audioContext);
                    const listener = spy();

                    audioWorkletNode.port.onmessage = listener;

                    constantSourceNode.connect(audioWorkletNode);
                    constantSourceNode.start();

                    setTimeout(() => {
                        expect(listener).to.have.not.been.called;

                        done();
                    }, 500);
                });
        });

    });

    describe('with a module depending on another module', () => {

        beforeEach(async () => {
            await audioContext.audioWorklet.addModule('base/test/fixtures/library.js');
            await audioContext.audioWorklet.addModule('base/test/fixtures/dependent-processor.js');
        });

        // bug #91

        it('should not persist the scope across calls to addModule()', (done) => {
            const audioWorkletNode = new AudioWorkletNode(audioContext, 'dependent-processor');

            audioWorkletNode.port.onmessage = ({ data }) => {
                audioWorkletNode.port.onmessage = null;

                expect(data.typeOfLibrary).to.equal('undefined');

                done();
            };

            audioWorkletNode.port.postMessage(null);
        });

    });

});
