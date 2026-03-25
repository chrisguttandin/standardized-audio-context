import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createIsAnyOfflineAudioContext } from '../../../src/factories/is-any-offline-audio-context';

describe('isAnyOfflineAudioContext()', () => {
    let contextStore;
    let isAnyOfflineAudioContext;
    let isNativeOfflineAudioContext;

    beforeEach(() => {
        contextStore = new WeakMap();
        isNativeOfflineAudioContext = vi.fn();

        isAnyOfflineAudioContext = createIsAnyOfflineAudioContext(contextStore, isNativeOfflineAudioContext);
    });

    describe('without any OfflineAudioContext in the store', () => {
        describe('with an object which gets not identified as native OfflineAudioContext', () => {
            let anything;

            beforeEach(() => {
                anything = { any: 'object' };

                isNativeOfflineAudioContext.mockImplementation((arg) => {
                    if (arg === anything) {
                        return false;
                    }
                });
            });

            it('should return false', () => {
                expect(isAnyOfflineAudioContext(anything)).to.be.false;
            });
        });

        describe('with an OfflineAudioContext which gets identified as native', () => {
            let nativeOfflineAudioContext;

            beforeEach(() => {
                nativeOfflineAudioContext = { a: 'fake native OfflineAudioContext' };

                isNativeOfflineAudioContext.mockImplementation((arg) => {
                    if (arg === nativeOfflineAudioContext) {
                        return true;
                    }
                });
            });

            it('should return true', () => {
                expect(isAnyOfflineAudioContext(nativeOfflineAudioContext)).to.be.true;
            });
        });
    });

    describe('with an OfflineAudioContext in the store', () => {
        let offlineAudioContext;

        beforeEach(() => {
            offlineAudioContext = { a: 'fake OfflineAudioContext' };
        });

        describe('with a mapped object which gets not identified as native OfflineAudioContext', () => {
            beforeEach(() => {
                const anything = { any: 'object' };

                contextStore.set(offlineAudioContext, anything);

                isNativeOfflineAudioContext.mockImplementation((arg) => {
                    if (arg === anything) {
                        return false;
                    }

                    if (arg === offlineAudioContext) {
                        return false;
                    }
                });
            });

            it('should return false', () => {
                expect(isAnyOfflineAudioContext(offlineAudioContext)).to.be.false;
            });
        });

        describe('with a mapped OfflineAudioContext which gets identified as native', () => {
            beforeEach(() => {
                const nativeOfflineAudioContext = { a: 'fake native OfflineAudioContext' };

                contextStore.set(offlineAudioContext, nativeOfflineAudioContext);

                isNativeOfflineAudioContext.mockImplementation((arg) => {
                    if (arg === nativeOfflineAudioContext) {
                        return true;
                    }
                });
            });

            it('should return true', () => {
                expect(isAnyOfflineAudioContext(offlineAudioContext)).to.be.true;
            });
        });
    });
});
