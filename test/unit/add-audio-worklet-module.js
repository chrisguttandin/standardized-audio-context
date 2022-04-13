import { AudioWorkletNode, addAudioWorkletModule as ddDWrkltMdl } from '../../src/module';
import { createAudioContext } from '../helper/create-audio-context';
import { createMinimalAudioContext } from '../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';
import { isSafari } from '../helper/is-safari';

const createAddAudioWorkletModuleWithAudioWorkletOfContext = (context) => {
    return context.audioWorklet.addModule;
};
const createAddAudioWorkletModuleWithGlobalAudioWorklet = (context) => {
    return ddDWrkltMdl.bind(null, context);
};
const testCases = {
    'addAudioWorkletModule() with a MinimalAudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: createMinimalAudioContext
    },
    'addAudioWorkletModule() with a MinimalOfflineAudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithGlobalAudioWorklet,
        createContext: createMinimalOfflineAudioContext
    },
    'audioWorklet.addModule() with an AudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithAudioWorkletOfContext,
        createContext: createAudioContext
    },
    'audioWorklet.addModule() with an OfflineAudioContext': {
        createAddAudioWorkletModule: createAddAudioWorkletModuleWithAudioWorkletOfContext,
        createContext: createOfflineAudioContext
    }
};

describe('audioWorklet.addModule() / addAudioWorkletModule()', () => {
    for (const [description, { createAddAudioWorkletModule, createContext }] of Object.entries(testCases)) {
        describe(`with the ${description}`, () => {
            let addAudioWorkletModule;
            let context;

            afterEach(() => {
                if (context.close !== undefined) {
                    return context.close();
                }
            });

            beforeEach(() => {
                context = createContext();
                addAudioWorkletModule = createAddAudioWorkletModule(context);
            });

            describe('with a missing module', () => {
                it('should return a promise which rejects an AbortError', function (done) {
                    this.timeout(10000);

                    addAudioWorkletModule('base/test/fixtures/missing-processor.js').catch((err) => {
                        expect(err.code).to.equal(20);
                        expect(err.name).to.equal('AbortError');

                        done();
                    });
                });
            });

            describe('with an unparsable module', () => {
                it('should return a promise which rejects a SyntaxError', function (done) {
                    this.timeout(10000);

                    addAudioWorkletModule('base/test/fixtures/unparsable-processor.xs').catch((err) => {
                        // Bug #177 Firefox does not throw a SyntaxError.
                        if (/Firefox/.test(navigator.userAgent)) {
                            expect(err).to.be.an.instanceOf(Error);
                        } else {
                            // Bug #182 Chrome and Edge do throw an instance of a SyntaxError instead of a DOMException.
                            expect(err).to.be.an.instanceOf(SyntaxError);
                        }

                        done();
                    });
                });
            });

            describe('with a previously unknown module', () => {
                it('should return a resolving promise', function () {
                    this.timeout(10000);

                    return addAudioWorkletModule('base/test/fixtures/gain-processor.js');
                });

                it('should not be possible to create an AudioWorkletNode', (done) => {
                    try {
                        new AudioWorkletNode(context, 'gain-processor');
                    } catch (err) {
                        expect(err.code).to.equal(9);
                        expect(err.name).to.equal('NotSupportedError');

                        done();
                    }
                });
            });

            describe('with a previously added module', () => {
                beforeEach(function () {
                    this.timeout(10000);

                    return addAudioWorkletModule('base/test/fixtures/gain-processor.js');
                });

                describe('with the same module', () => {
                    it('should return a resolving promise', function () {
                        this.timeout(10000);

                        return addAudioWorkletModule('base/test/fixtures/gain-processor.js');
                    });

                    it('should be possible to create an AudioWorkletNode', async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/gain-processor.js');

                        new AudioWorkletNode(context, 'gain-processor');
                    });
                });

                describe('with another module', () => {
                    it('should return a resolving promise', function () {
                        this.timeout(10000);

                        return addAudioWorkletModule('base/test/fixtures/inspector-processor.js');
                    });

                    it('should be possible to create an AudioWorkletNode', async function () {
                        this.timeout(10000);

                        await addAudioWorkletModule('base/test/fixtures/inspector-processor.js');

                        new AudioWorkletNode(context, 'inspector-processor');
                    });
                });
            });

            describe('with a module which ends with a comment', () => {
                it('should return a resolving promise', function () {
                    this.timeout(10000);

                    return addAudioWorkletModule('base/test/fixtures/gain-processor-with-comment.xs');
                });
            });

            describe('with a module which contains an import statement', () => {
                if (!/Firefox/.test(navigator.userAgent) && !isSafari(navigator)) {
                    // Bug #176 Firefox and Safari do not support import statements yet.
                    it('should return a resolving promise', function () {
                        this.timeout(10000);

                        return addAudioWorkletModule('base/test/fixtures/gibberish-processor.js');
                    });
                }
            });
        });
    }
});
