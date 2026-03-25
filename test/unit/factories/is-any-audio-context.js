import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createIsAnyAudioContext } from '../../../src/factories/is-any-audio-context';

describe('isAnyAudioContext()', () => {
    let contextStore;
    let isAnyAudioContext;
    let isNativeAudioContext;

    beforeEach(() => {
        contextStore = new WeakMap();
        isNativeAudioContext = vi.fn();

        isAnyAudioContext = createIsAnyAudioContext(contextStore, isNativeAudioContext);
    });

    describe('without any AudioContext in the store', () => {
        describe('with an object which gets not identified as native AudioContext', () => {
            let anything;

            beforeEach(() => {
                anything = { any: 'object' };

                isNativeAudioContext.mockImplementation((arg) => {
                    if (arg === anything) {
                        return false;
                    }
                });
            });

            it('should return false', () => {
                expect(isAnyAudioContext(anything)).to.be.false;
            });
        });

        describe('with an AudioContext which gets identified as native', () => {
            let nativeAudioContext;

            beforeEach(() => {
                nativeAudioContext = { a: 'fake native AudioContext' };

                isNativeAudioContext.mockImplementation((arg) => {
                    if (arg === nativeAudioContext) {
                        return true;
                    }
                });
            });

            it('should return true', () => {
                expect(isAnyAudioContext(nativeAudioContext)).to.be.true;
            });
        });
    });

    describe('with an AudioContext in the store', () => {
        let audioContext;

        beforeEach(() => {
            audioContext = { a: 'fake AudioContext' };
        });

        describe('with a mapped object which gets not identified as native AudioContext', () => {
            beforeEach(() => {
                const anything = { any: 'object' };

                contextStore.set(audioContext, anything);

                isNativeAudioContext.mockImplementation((arg) => {
                    if (arg === anything) {
                        return false;
                    }

                    if (arg === audioContext) {
                        return false;
                    }
                });
            });

            it('should return false', () => {
                expect(isAnyAudioContext(audioContext)).to.be.false;
            });
        });

        describe('with a mapped AudioContext which gets identified as native', () => {
            beforeEach(() => {
                const nativeAudioContext = { a: 'fake native AudioContext' };

                contextStore.set(audioContext, nativeAudioContext);

                isNativeAudioContext.mockImplementation((arg) => {
                    if (arg === nativeAudioContext) {
                        return true;
                    }
                });
            });

            it('should return true', () => {
                expect(isAnyAudioContext(audioContext)).to.be.true;
            });
        });
    });
});
