import '../helper/play-silence';
import { AudioWorkletNode, addAudioWorkletModule } from '../../src/module';
import { createAudioContext } from '../helper/create-audio-context';
import { createMinimalAudioContext } from '../helper/create-minimal-audio-context';
import { createMinimalOfflineAudioContext } from '../helper/create-minimal-offline-audio-context';
import { createOfflineAudioContext } from '../helper/create-offline-audio-context';

const createAddAudioWorkletModuleWithAudioWorkletOfContext = (context) => {
    return context.audioWorklet.addModule;
};
const createAddAudioWorkletModuleWithGlobalAudioWorklet = (context) => {
    return addAudioWorkletModule.bind(null, context);
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

// @todo Skip about 50% of the test cases when running on Travis to prevent the browsers from crashing while running the tests.
if (process.env.TRAVIS) { // eslint-disable-line no-undef
    for (const description of Object.keys(testCases)) {
        if (Math.random() < 0.5) {
            delete testCases[ description ];
        }
    }
}

describe('audioWorklet.addModule() / addAudioWorkletModule()', () => {

    for (const [ description, { createAddAudioWorkletModule, createContext } ] of Object.entries(testCases)) {

        describe(`with the ${ description }`, () => {

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

                it('should return a promise which rejects an AbortError', (done) => {
                    addAudioWorkletModule('base/test/fixtures/missing-processor.js')
                        .catch((err) => {
                            expect(err.code).to.equal(20);
                            expect(err.name).to.equal('AbortError');

                            done();
                        });
                });

            });

            describe('with an unparsable module', () => {

                it('should return a promise which rejects an AbortError', (done) => {
                    addAudioWorkletModule('base/test/fixtures/unparsable-processor.xs')
                        .catch((err) => {
                            expect(err.code).to.equal(20);
                            expect(err.name).to.equal('AbortError');

                            done();
                        });
                });

            });

            describe('with a previously unknown module', () => {

                it('should return a resolving promise', () => {
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

                beforeEach(() => {
                    return addAudioWorkletModule('base/test/fixtures/gain-processor.js');
                });

                it('should return a resolving promise', () => {
                    return addAudioWorkletModule('base/test/fixtures/gain-processor.js');
                });

                it('should be possible to create an AudioWorkletNode', () => {
                    new AudioWorkletNode(context, 'gain-processor');
                });

            });

        });

    }

});
