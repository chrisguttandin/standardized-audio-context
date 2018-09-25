import '../helper/play-silence';
import { AudioBuffer } from '../../src/module';
import { BACKUP_NATIVE_CONTEXT_STORE } from '../../src/globals';
import { createAudioContext } from '../helper/create-audio-context';
import { createNativeAudioContextConstructor } from '../../src/factories/native-audio-context-constructor';
import { createNativeOfflineAudioContextConstructor } from '../../src/factories/native-offline-audio-context-constructor';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';
import { createWindow } from '../../src/factories/window';

const createAudioBufferWithConstructor = (_, numberOfChannels, length, sampleRate) => {
    return new AudioBuffer({ length, numberOfChannels, sampleRate });
};
const createAudioBufferWithFactoryFunction = (context, numberOfChannels, length, sampleRate) => {
    return context.createBuffer(numberOfChannels, length, sampleRate);
};
const testCases = {
    'constructor': {
        createAudioBuffer: createAudioBufferWithConstructor,
        createContext: null
    },
    'factory function of an AudioContext': {
        createAudioBuffer: createAudioBufferWithFactoryFunction,
        createContext: createAudioContext
    },
    'factory function of an OfflineAudioContext': {
        createAudioBuffer: createAudioBufferWithFactoryFunction,
        createContext: createOfflineAudioContext
    }
};

describe('AudioBuffer', () => {

    for (const [ description, { createAudioBuffer, createContext } ] of Object.entries(testCases)) {

        describe(`with the ${ description }`, () => {

            let context;

            afterEach(() => {
                if (context !== null && context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => {
                context = (createContext === null) ? null : createContext();
            });

            describe('constructor()', () => {

                for (const audioContextState of (createContext === null) ? [ 'running' ] : [ 'closed', 'running' ]) {

                    describe(`with an audioContextState of "${ audioContextState }"`, () => {

                        afterEach(() => {
                            if (audioContextState === 'closed') {
                                const backupNativeContext = BACKUP_NATIVE_CONTEXT_STORE.get(context._nativeContext);

                                // Bug #94: Edge also exposes a close() method on an OfflineAudioContext which is why this check is necessary.
                                if (backupNativeContext !== undefined && backupNativeContext.startRendering === undefined) {
                                    context = backupNativeContext;
                                } else {
                                    context.close = undefined;
                                }
                            }
                        });

                        beforeEach(() => {
                            if (audioContextState === 'closed') {
                                if (context.close === undefined) {
                                    return context.startRendering();
                                }

                                return context.close();
                            }
                        });

                        describe('with valid options', () => {

                            let audioBuffer;

                            beforeEach(() => {
                                audioBuffer = createAudioBuffer(context, 2, 10, 44100);
                            });

                            it('should return an instance of the AudioBuffer interface', () => {
                                expect(audioBuffer.duration).to.be.closeTo(10 / 44100, 0.001);
                                expect(audioBuffer.length).to.equal(10);
                                expect(audioBuffer.numberOfChannels).to.equal(2);
                                expect(audioBuffer.sampleRate).to.equal(44100);
                                expect(audioBuffer.getChannelData).to.be.a('function');
                                expect(audioBuffer.copyFromChannel).to.be.a('function');
                                expect(audioBuffer.copyToChannel).to.be.a('function');
                            });

                            it('should return an AudioBuffer which can be used with a native AudioContext', () => {
                                const window = createWindow();
                                const nativeAudioContextConstructor = createNativeAudioContextConstructor(window);
                                const nativeAudioContext = new nativeAudioContextConstructor(); // eslint-disable-line new-cap
                                const nativeAudioBufferSourceNode = nativeAudioContext.createBufferSource();

                                nativeAudioBufferSourceNode.buffer = audioBuffer;

                                return nativeAudioContext.close();
                            });

                            it('should return an AudioBuffer which can be used with a native OfflineAudioContext', () => {
                                const window = createWindow();
                                const nativeOfflineAudioContextConstructor = createNativeOfflineAudioContextConstructor(window);
                                const nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100); // eslint-disable-line new-cap
                                const nativeAudioBufferSourceNode = nativeOfflineAudioContext.createBufferSource();

                                nativeAudioBufferSourceNode.buffer = audioBuffer;

                                return nativeOfflineAudioContext.startRendering();
                            });

                        });

                        describe('with invalid options', () => {

                            describe('with zero as the numberOfChannels', () => {

                                it('should throw an NotSupportedError', (done) => {
                                    try {
                                        createAudioBuffer(context, 0, 10, 44100);
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });

                            });

                            describe('with a length of zero', () => {

                                it('should throw an NotSupportedError', (done) => {
                                    try {
                                        createAudioBuffer(context, 2, 0, 44100);
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });

                            });

                            describe('with a sampleRate of zero', () => {

                                it('should throw an NotSupportedError', (done) => {
                                    try {
                                        createAudioBuffer(context, 2, 10, 0);
                                    } catch (err) {
                                        expect(err.code).to.equal(9);
                                        expect(err.name).to.equal('NotSupportedError');

                                        done();
                                    }
                                });

                            });

                        });

                    });

                }

            });

            describe('duration', () => {

                let audioBuffer;

                beforeEach(() => {
                    audioBuffer = createAudioBuffer(context, 2, 10, 44100);
                });

                it('should be readonly', () => {
                    expect(() => {
                        audioBuffer.duration = 10;
                    }).to.throw(TypeError);
                });

            });

            describe('length', () => {

                let audioBuffer;

                beforeEach(() => {
                    audioBuffer = createAudioBuffer(context, 2, 10, 44100);
                });

                it('should be readonly', () => {
                    expect(() => {
                        audioBuffer.length = 20;
                    }).to.throw(TypeError);
                });

            });

            describe('numberOfChannels', () => {

                let audioBuffer;

                beforeEach(() => {
                    audioBuffer = createAudioBuffer(context, 2, 10, 44100);
                });

                it('should be readonly', () => {
                    expect(() => {
                        audioBuffer.numberOfChannels = 6;
                    }).to.throw(TypeError);
                });

            });

            describe('sampleRate', () => {

                let audioBuffer;

                beforeEach(() => {
                    audioBuffer = createAudioBuffer(context, 2, 10, 44100);
                });

                it('should be readonly', () => {
                    expect(() => {
                        audioBuffer.sampleRate = 22050;
                    }).to.throw(TypeError);
                });

            });

            describe('copyFromChannel()', () => {

                let audioBuffer;
                let destination;

                beforeEach(() => {
                    audioBuffer = createAudioBuffer(context, 2, 10, 44100);
                    destination = new Float32Array(10);
                });

                it('should not allow to copy a channel with a number greater or equal than the number of channels', (done) => {
                    try {
                        audioBuffer.copyFromChannel(destination, 2);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

                it('should not allow to copy values with an offset greater than the length', (done) => {
                    try {
                        audioBuffer.copyFromChannel(destination, 0, 10);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

            });

            describe('copyToChannel()', () => {

                let audioBuffer;
                let source;

                beforeEach(() => {
                    audioBuffer = createAudioBuffer(context, 2, 10, 44100);
                    source = new Float32Array(10);
                });

                it('should not allow to copy a channel with a number greater or equal than the number of channels', (done) => {
                    try {
                        audioBuffer.copyToChannel(source, 2);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

                it('should not allow to copy values with an offset greater than the length', (done) => {
                    try {
                        audioBuffer.copyToChannel(source, 0, 10);
                    } catch (err) {
                        expect(err.code).to.equal(1);
                        expect(err.name).to.equal('IndexSizeError');

                        done();
                    }
                });

            });

            describe('copyFromChannel()/copyToChannel()', () => {

                let audioBuffer;
                let destination;
                let source;

                beforeEach(() => {
                    audioBuffer = createAudioBuffer(context, 2, 100, 44100);
                    destination = new Float32Array(10);
                    source = new Float32Array(10);

                    for (let i = 0; i < 10; i += 1) {
                        destination[i] = Math.random();
                        source[i] = Math.random();
                    }
                });

                it('should copy values with an offset of 0', () => {
                    audioBuffer.copyToChannel(source, 0);
                    audioBuffer.copyFromChannel(destination, 0);

                    for (let i = 0; i < 10; i += 1) {
                        expect(destination[i]).to.equal(source[i]);
                    }
                });

                it('should copy values with an offset of 50', () => {
                    audioBuffer.copyToChannel(source, 0, 50);
                    audioBuffer.copyFromChannel(destination, 0, 50);

                    for (let i = 0; i < 10; i += 1) {
                        expect(destination[i]).to.equal(source[i]);
                    }
                });

                it('should copy values with an offset large enough to leave a part of the destination untouched', () => {
                    const destinationCopy = Array.from(destination);

                    audioBuffer.copyToChannel(source, 0, 95);
                    audioBuffer.copyFromChannel(destination, 0, 95);

                    for (let i = 0; i < 5; i += 1) {
                        expect(destination[i]).to.equal(source[i]);
                    }

                    for (let i = 5; i < 10; i += 1) {
                        expect(destination[i]).to.equal(destinationCopy[i]);
                    }
                });

                it('should copy values with an offset low enough to leave a part of the buffer untouched', () => {
                    audioBuffer.copyToChannel(source, 0, 35);
                    audioBuffer.copyToChannel(source, 0, 25);
                    audioBuffer.copyFromChannel(destination, 0, 35);

                    for (let i = 0; i < 10; i += 1) {
                        expect(destination[i]).to.equal(source[i]);
                    }
                });

            });

        });

    }

});
