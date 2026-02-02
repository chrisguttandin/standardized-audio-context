import { beforeEach, describe, expect, it } from 'vitest';
import { createIsAnyAudioParam } from '../../../src/factories/is-any-audio-param';
import { stub } from 'sinon';

describe('isAnyAudioParam()', () => {
    let audioParamStore;
    let isAnyAudioParam;
    let isNativeAudioParam;

    beforeEach(() => {
        audioParamStore = new WeakMap();
        isNativeAudioParam = stub();

        isAnyAudioParam = createIsAnyAudioParam(audioParamStore, isNativeAudioParam);
    });

    describe('without any AudioParam in the store', () => {
        beforeEach(() => {
            isNativeAudioParam.returns(false);
        });

        it('should not identify any AudioParam', () => {
            expect(isAnyAudioParam({ a: 'fake AudioParam' })).to.be.false;
        });
    });

    describe('with an AudioParam in the store', () => {
        let audioParam;

        beforeEach(() => {
            audioParam = { a: 'fake AudioParam' };

            audioParamStore.set(audioParam, { a: 'fake native AudioParam' });
            isNativeAudioParam.returns(false);
        });

        it('should identify the stored AudioParam', () => {
            expect(isAnyAudioParam(audioParam)).to.be.true;
        });

        it('should not identify any other AudioParam', () => {
            expect(isAnyAudioParam({ another: 'fake AudioParam' })).to.be.false;
        });
    });

    describe('with an AudioParam which gets identified as native', () => {
        beforeEach(() => {
            isNativeAudioParam.returns(true);
        });

        it('should identify a native AudioParam', () => {
            expect(isAnyAudioParam({ a: 'fake AudioParam' })).to.be.true;
        });
    });
});
