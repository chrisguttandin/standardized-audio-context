import { createAudioContext } from '../helper/create-audio-context';
import { createMinimalAudioContext } from '../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../helper/create-minimal-offline-audio-context';
import { createNativeAudioContext } from '../helper/create-native-audio-context';
import { createNativeOfflineAudioContext } from '../helper/create-native-offline-audio-context';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';
import { loadFixtureAsArrayBuffer } from '../helper/load-fixture';
import { spy } from 'sinon';
import { decodeAudioData as standaloneDecodeAudioData } from '../../src/module';

const decodeAudioDataOfContext = (context, arrayBuffer, successCallback, errorCallback) => {
    return context.decodeAudioData(arrayBuffer, successCallback, errorCallback);
};
const decodeAudioDataWithContext = (context, arrayBuffer) => {
    return standaloneDecodeAudioData(context, arrayBuffer);
};
const testCases = {
    'decodeAudioData function of an AudioContext': {
        createContext: createAudioContext,
        decodeAudioData: decodeAudioDataOfContext
    },
    'decodeAudioData function of an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        decodeAudioData: decodeAudioDataOfContext
    },
    'standalone decodeAudioData function with a MinimalAudioContext': {
        createContext: createMinimalAudioContext,
        decodeAudioData: decodeAudioDataWithContext
    },
    'standalone decodeAudioData function with a MinimalOfflineAudioContext': {
        createContext: createMinimalOfflineAudioContext,
        decodeAudioData: decodeAudioDataWithContext
    },
    'standalone decodeAudioData function with a native AudioContext': {
        createContext: createNativeAudioContext,
        decodeAudioData: decodeAudioDataWithContext
    },
    'standalone decodeAudioData function with a native OfflineAudioContext': {
        createContext: createNativeOfflineAudioContext,
        decodeAudioData: decodeAudioDataWithContext
    },
    'standalone decodeAudioData function with an AudioContext': {
        createContext: createAudioContext,
        decodeAudioData: decodeAudioDataWithContext
    },
    'standalone decodeAudioData function with an OfflineAudioContext': {
        createContext: createOfflineAudioContext,
        decodeAudioData: decodeAudioDataWithContext
    }
};

if (typeof window !== 'undefined') {
    describe('decodeAudioData()', () => {
        for (const [description, { createContext, decodeAudioData }] of Object.entries(testCases)) {
            describe(`with the ${description}`, () => {
                let context;

                afterEach(() => context.close?.());

                beforeEach(() => (context = createContext()));

                it('should return a promise', () => {
                    const promise = decodeAudioData(context);

                    promise.catch(() => {
                        // Ignore the error.
                    });

                    expect(promise).to.be.an.instanceOf(Promise);
                });

                describe('without a valid arrayBuffer', () => {
                    it('should throw an error', function (done) {
                        this.timeout(10000);

                        decodeAudioData(context, null).catch((err) => {
                            expect(err).to.be.an.instanceOf(TypeError);

                            done();
                        });
                    });

                    if (!description.includes('standalone')) {
                        it('should call the errorCallback with a TypeError', function (done) {
                            this.timeout(10000);

                            decodeAudioData(
                                context,
                                null,
                                () => {},
                                (err) => {
                                    expect(err).to.be.an.instanceOf(TypeError);

                                    done();
                                }
                            ).catch(() => {
                                // Ignore the error.
                            });
                        });

                        // The promise is rejected before but the errorCallback gets called synchronously.
                        it('should call the errorCallback before the promise gets rejected', function (done) {
                            this.timeout(10000);

                            const errorCallback = spy();

                            decodeAudioData(context, null, () => {}, errorCallback).catch(() => {
                                expect(errorCallback).to.have.been.calledOnce;

                                done();
                            });
                        });
                    }
                });

                describe('with an arrayBuffer of an unsupported file', () => {
                    let arrayBuffer;

                    beforeEach(async function () {
                        this.timeout(10000);

                        // PNG files are not supported by any browser :-)
                        arrayBuffer = await loadFixtureAsArrayBuffer('one-pixel-of-transparency.png');
                    });

                    it('should throw an error', function (done) {
                        this.timeout(10000);

                        decodeAudioData(context, arrayBuffer).catch((err) => {
                            expect(err.code).to.equal(0);
                            expect(err.name).to.equal('EncodingError');

                            done();
                        });
                    });

                    if (!description.includes('standalone')) {
                        it('should call the errorCallback with an error', function (done) {
                            this.timeout(10000);

                            decodeAudioData(
                                context,
                                arrayBuffer,
                                () => {},
                                (err) => {
                                    expect(err.code).to.equal(0);
                                    expect(err.name).to.equal('EncodingError');

                                    done();
                                }
                            ).catch(() => {
                                // Ignore the error.
                            });
                        });

                        // The promise is rejected before but the errorCallback gets called synchronously.
                        it('should call the errorCallback before the promise gets rejected', function (done) {
                            this.timeout(10000);

                            const errorCallback = spy();

                            decodeAudioData(context, arrayBuffer, () => {}, errorCallback).catch(() => {
                                expect(errorCallback).to.have.been.calledOnce;

                                done();
                            });
                        });
                    }
                });

                describe('with an arrayBuffer of a supported file', () => {
                    let arrayBuffer;

                    beforeEach(async function () {
                        this.timeout(10000);

                        arrayBuffer = await loadFixtureAsArrayBuffer('1000-frames-of-noise-stereo.wav');
                    });

                    it('should resolve to the promise', function () {
                        this.timeout(10000);

                        return decodeAudioData(context, arrayBuffer);
                    });

                    if (!description.includes('standalone')) {
                        it('should call the successCallback', function (done) {
                            this.timeout(10000);

                            decodeAudioData(context, arrayBuffer, () => {
                                done();
                            });
                        });

                        // The promise is resolved before but the successCallback gets called synchronously.
                        it('should call the successCallback before the promise gets resolved', function () {
                            this.timeout(10000);

                            const successCallback = spy();

                            return decodeAudioData(context, arrayBuffer, successCallback).then(() => {
                                expect(successCallback).to.have.been.calledOnce;
                            });
                        });
                    }

                    it('should throw a DataCloneError', function (done) {
                        this.timeout(10000);

                        decodeAudioData(context, arrayBuffer)
                            .then(() => decodeAudioData(context, arrayBuffer))
                            .catch((err) => {
                                expect(err.code).to.equal(25);
                                expect(err.name).to.equal('DataCloneError');

                                done();
                            });
                    });

                    it('should neuter the arrayBuffer', async function () {
                        this.timeout(10000);

                        await decodeAudioData(context, arrayBuffer);

                        expect(() => {
                            // Firefox will throw an error when using a neutered ArrayBuffer.
                            const uint8Array = new Uint8Array(arrayBuffer);

                            // Chrome and Safari will throw an error when trying to convert a typed array with a neutered ArrayBuffer.
                            Array.from(uint8Array);
                        }).to.throw(Error);
                    });

                    it('should allow to encode various arrayBuffers in parallel', function () {
                        this.timeout(10000);

                        const arrayBufferCopies = [];

                        for (let i = 1; i < 100; i += 1) {
                            arrayBufferCopies.push(arrayBuffer.slice(0));
                        }

                        return Promise.all(arrayBufferCopies.map((rrBffr) => decodeAudioData(context, rrBffr)));
                    });
                });
            });
        }
    });
}
