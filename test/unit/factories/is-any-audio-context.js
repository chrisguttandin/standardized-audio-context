import { beforeEach, describe, expect, it } from 'vitest';
import { createIsAnyAudioContext } from '../../../src/factories/is-any-audio-context';
import { stub } from 'sinon';

describe('isAnyAudioContext()', () => {
    let contextStore;
    let isAnyAudioContext;
    let isNativeAudioContext;

    beforeEach(() => {
        contextStore = new WeakMap();
        isNativeAudioContext = stub();

        isAnyAudioContext = createIsAnyAudioContext(contextStore, isNativeAudioContext);
    });

    describe('without any AudioContext in the store', () => {
        describe('with an object which gets not identified as native AudioContext', () => {
            let anything;

            beforeEach(() => {
                anything = { any: 'object' };

                isNativeAudioContext.withArgs(anything).returns(false);
            });

            it('should return false', () => {
                expect(isAnyAudioContext(anything)).to.be.false;
            });
        });

        describe('with an AudioContext which gets identified as native', () => {
            let nativeAudioContext;

            beforeEach(() => {
                nativeAudioContext = { a: 'fake native AudioContext' };

                isNativeAudioContext.withArgs(nativeAudioContext).returns(true);
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

                isNativeAudioContext.withArgs(anything).returns(false);
                isNativeAudioContext.withArgs(audioContext).returns(false);
            });

            it('should return false', () => {
                expect(isAnyAudioContext(audioContext)).to.be.false;
            });
        });

        describe('with a mapped AudioContext which gets identified as native', () => {
            beforeEach(() => {
                const nativeAudioContext = { a: 'fake native AudioContext' };

                contextStore.set(audioContext, nativeAudioContext);

                isNativeAudioContext.withArgs(nativeAudioContext).returns(true);
            });

            it('should return true', () => {
                expect(isAnyAudioContext(audioContext)).to.be.true;
            });
        });
    });
});
