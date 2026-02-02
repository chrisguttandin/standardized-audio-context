import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('AudioWorklet', () => {
    describe('with a failing processor', () => {
        let offlineAudioContext;

        beforeEach(async () => {
            offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);

            await offlineAudioContext.audioWorklet.addModule('test/fixtures/failing-processor.js');
        });

        // bug #178

        it('should fire an error event', () => {
            const { promise, resolve } = Promise.withResolvers();
            const audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'failing-processor');

            audioWorkletNode.onprocessorerror = (event) => {
                expect(event.type).to.equal('error');

                resolve();
            };

            audioWorkletNode.connect(offlineAudioContext.destination);

            offlineAudioContext.startRendering();

            return promise;
        });
    });

    describe('with a closed context', () => {
        let audioContext;

        beforeEach(async () => {
            audioContext = new AudioContext();

            await audioContext.close();
            await audioContext.audioWorklet.addModule('test/fixtures/gain-processor.js');
        });

        // bug #186

        it('should throw a DOMException', () => {
            expect(() => new AudioWorkletNode(audioContext, 'gain-processor'))
                .to.throw(
                    DOMException,
                    "Failed to construct 'AudioWorkletNode': AudioWorkletNode cannot be created: No execution context available."
                )
                .with.property('name', 'InvalidStateError');
        });
    });

    describe('with a module depending on another module', () => {
        let offlineAudioContext;

        beforeEach(async () => {
            offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);

            await offlineAudioContext.audioWorklet.addModule('test/fixtures/library.js');
            await offlineAudioContext.audioWorklet.addModule('test/fixtures/dependent-processor.js');
        });

        // bug #91

        it('should not persist the scope across calls to addModule()', () => {
            const { promise, resolve } = Promise.withResolvers();
            const audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'dependent-processor');

            audioWorkletNode.port.onmessage = ({ data }) => {
                audioWorkletNode.port.onmessage = null;

                expect(data.typeOfLibrary).to.equal('undefined');

                resolve();
            };

            audioWorkletNode.port.postMessage(null);

            return promise;
        });
    });

    describe('with the name of an unknown processor', () => {
        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
        });

        // bug #60

        it('should throw an InvalidStateError', () => {
            expect(() => new AudioWorkletNode(offlineAudioContext, 'unknown-processor'))
                .to.throw(DOMException)
                .with.property('name', 'InvalidStateError');
        });
    });

    describe('with a suspended and resumed AudioContext', () => {
        let audioContext;

        afterEach(async () => {
            await audioContext.close();
        });

        beforeEach(() => {
            audioContext = new AudioContext();
        });

        // bug #204

        it('should increase currentFrame by a value other than 128', async () => {
            await audioContext.audioWorklet.addModule('test/fixtures/inspector-processor.js');

            while (true) {
                await audioContext.suspend();

                const constantSourceNode = new ConstantSourceNode(audioContext);
                const audioWorkletNode = new AudioWorkletNode(audioContext, 'inspector-processor');

                constantSourceNode.connect(audioWorkletNode).connect(audioContext.destination);
                constantSourceNode.start();

                const [result] = await Promise.all([
                    new Promise((resolve) => {
                        let lastCurrentFrame = null;
                        let numberOfEvents = 0;

                        audioWorkletNode.port.onmessage = ({ data }) => {
                            const { currentFrame } = data;

                            if (lastCurrentFrame !== null && lastCurrentFrame + 128 !== currentFrame) {
                                resolve(true);
                            } else if (numberOfEvents > 5) {
                                resolve(false);
                            }

                            lastCurrentFrame = currentFrame;
                            numberOfEvents += 1;
                        };
                    }),
                    audioContext.resume()
                ]);

                audioWorkletNode.port.onmessage = null;

                audioWorkletNode.port.close();
                audioWorkletNode.disconnect(audioContext.destination);

                constantSourceNode.stop();
                constantSourceNode.disconnect(audioWorkletNode);

                if (result) {
                    break;
                }

                if (audioContext.currentTime > 10) {
                    await audioContext.close();

                    audioContext = new AudioContext();

                    await audioContext.audioWorklet.addModule('test/fixtures/inspector-processor.js');
                }
            }
        });
    });
});
