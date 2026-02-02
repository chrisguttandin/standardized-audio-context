import { beforeEach, describe, expect, it } from 'vitest';
import { createIsAnyOfflineAudioContext } from '../../../src/factories/is-any-offline-audio-context';
import { stub } from 'sinon';

describe('isAnyOfflineAudioContext()', () => {
    let contextStore;
    let isAnyOfflineAudioContext;
    let isNativeOfflineAudioContext;

    beforeEach(() => {
        contextStore = new WeakMap();
        isNativeOfflineAudioContext = stub();

        isAnyOfflineAudioContext = createIsAnyOfflineAudioContext(contextStore, isNativeOfflineAudioContext);
    });

    describe('without any OfflineAudioContext in the store', () => {
        describe('with an object which gets not identified as native OfflineAudioContext', () => {
            let anything;

            beforeEach(() => {
                anything = { any: 'object' };

                isNativeOfflineAudioContext.withArgs(anything).returns(false);
            });

            it('should return false', () => {
                expect(isAnyOfflineAudioContext(anything)).to.be.false;
            });
        });

        describe('with an OfflineAudioContext which gets identified as native', () => {
            let nativeOfflineAudioContext;

            beforeEach(() => {
                nativeOfflineAudioContext = { a: 'fake native OfflineAudioContext' };

                isNativeOfflineAudioContext.withArgs(nativeOfflineAudioContext).returns(true);
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

                isNativeOfflineAudioContext.withArgs(anything).returns(false);
                isNativeOfflineAudioContext.withArgs(offlineAudioContext).returns(false);
            });

            it('should return false', () => {
                expect(isAnyOfflineAudioContext(offlineAudioContext)).to.be.false;
            });
        });

        describe('with a mapped OfflineAudioContext which gets identified as native', () => {
            beforeEach(() => {
                const nativeOfflineAudioContext = { a: 'fake native OfflineAudioContext' };

                contextStore.set(offlineAudioContext, nativeOfflineAudioContext);

                isNativeOfflineAudioContext.withArgs(nativeOfflineAudioContext).returns(true);
            });

            it('should return true', () => {
                expect(isAnyOfflineAudioContext(offlineAudioContext)).to.be.true;
            });
        });
    });
});
