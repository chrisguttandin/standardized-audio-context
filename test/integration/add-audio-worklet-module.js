import { AudioWorkletNode, addAudioWorkletModule as ddDWrkltMdl } from '../../src/module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createAudioContext } from '../helper/create-audio-context';
import { createMinimalAudioContext } from '../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';

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

describe('audioWorklet.addModule() / addAudioWorkletModule()', { skip: typeof window === 'undefined' }, () => {
    describe.for(Object.entries(testCases))('with the %s', ([, { createAddAudioWorkletModule, createContext }]) => {
        let addAudioWorkletModule;
        let context;

        afterEach(() => context.close?.());

        beforeEach(() => {
            context = createContext();
            addAudioWorkletModule = createAddAudioWorkletModule(context);
        });

        describe('with a missing module', () => {
            it('should return a promise which rejects an AbortError', () => {
                return addAudioWorkletModule('test/fixtures/missing-processor.js').then(
                    () => {
                        throw new Error('This should never be called.');
                    },
                    (err) => {
                        expect(err.code).to.equal(20);
                        expect(err.name).to.equal('AbortError');
                    }
                );
            });
        });

        describe('with an unparsable module', () => {
            let url;

            afterEach(() => {
                URL.revokeObjectURL(url);
            });

            beforeEach(async () => {
                url = URL.createObjectURL(
                    await fetch(new URL('../fixtures/unparsable-processor.js', import.meta.url))
                        .then((response) => response.text())
                        .then((text) => text.replace("// some 'unparsable' syntax ()", "some 'unparsable' syntax ()"))
                        .then((text) => new Blob([text], { type: 'application/javascript; charset=utf-8' }))
                );
            });

            it('should return a promise which rejects a SyntaxError', () => {
                return addAudioWorkletModule(url).then(
                    () => {
                        throw new Error('This should never be called.');
                    },
                    (err) => {
                        expect(err).to.be.an.instanceOf(SyntaxError);
                    }
                );
            });
        });

        describe('with a previously unknown module', () => {
            it('should return a resolving promise', () => {
                return addAudioWorkletModule('test/fixtures/gain-processor.js');
            });

            it('should not be possible to create an AudioWorkletNode', () => {
                expect(() => {
                    new AudioWorkletNode(context, 'gain-processor');
                })
                    .to.throw(DOMException)
                    .to.include({ code: 9, name: 'NotSupportedError' });
            });
        });

        describe('with a previously added module', () => {
            beforeEach(() => {
                return addAudioWorkletModule('test/fixtures/gain-processor.js');
            });

            describe('with the same module', () => {
                it('should return a resolving promise', () => {
                    return addAudioWorkletModule('test/fixtures/gain-processor.js');
                });

                it('should be possible to create an AudioWorkletNode', async () => {
                    await addAudioWorkletModule('test/fixtures/gain-processor.js');

                    new AudioWorkletNode(context, 'gain-processor');
                });
            });

            describe('with another module', () => {
                it('should return a resolving promise', () => {
                    return addAudioWorkletModule('test/fixtures/inspector-processor.js');
                });

                it('should be possible to create an AudioWorkletNode', async () => {
                    await addAudioWorkletModule('test/fixtures/inspector-processor.js');

                    new AudioWorkletNode(context, 'inspector-processor');
                });
            });
        });

        describe('with a module which ends with a comment', () => {
            let url;

            afterEach(() => {
                URL.revokeObjectURL(url);
            });

            beforeEach(async () => {
                url = URL.createObjectURL(
                    await fetch(new URL('../fixtures/gain-processor-with-comment.js', import.meta.url))
                        .then((response) => response.text())
                        .then((text) =>
                            text.replace(
                                /\/\/ This is a comment which is meant to be the last line of the file with no following line break\..*/s,
                                '// This is a comment which is meant to be the last line of the file with no following line break.'
                            )
                        )
                        .then((text) => new Blob([text], { type: 'application/javascript; charset=utf-8' }))
                );
            });

            it('should return a resolving promise', () => {
                return addAudioWorkletModule(url);
            });
        });

        describe('with a module which contains an import statement', () => {
            it('should return a resolving promise', () => {
                return addAudioWorkletModule('test/fixtures/gibberish-processor.js');
            });
        });
    });
});
