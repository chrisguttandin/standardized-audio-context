import { beforeEach, describe, expect, it } from 'vitest';
import { createIsAnyAudioNode } from '../../../src/factories/is-any-audio-node';
import { stub } from 'sinon';

describe('isAnyAudioNode()', () => {
    let audioNodeStore;
    let isAnyAudioNode;
    let isNativeAudioNode;

    beforeEach(() => {
        audioNodeStore = new WeakMap();
        isNativeAudioNode = stub();

        isAnyAudioNode = createIsAnyAudioNode(audioNodeStore, isNativeAudioNode);
    });

    describe('without any AudioNode in the store', () => {
        beforeEach(() => {
            isNativeAudioNode.returns(false);
        });

        it('should not identify any AudioNode', () => {
            expect(isAnyAudioNode({ a: 'fake AudioNode' })).to.be.false;
        });
    });

    describe('with an AudioNode in the store', () => {
        let audioNode;

        beforeEach(() => {
            audioNode = { a: 'fake AudioNode' };

            audioNodeStore.set(audioNode, { a: 'fake native AudioNode' });
            isNativeAudioNode.returns(false);
        });

        it('should identify the stored AudioNode', () => {
            expect(isAnyAudioNode(audioNode)).to.be.true;
        });

        it('should not identify any other AudioNode', () => {
            expect(isAnyAudioNode({ another: 'fake AudioNode' })).to.be.false;
        });
    });

    describe('with an AudioNode which gets identified as native', () => {
        beforeEach(() => {
            isNativeAudioNode.returns(true);
        });

        it('should identify a native AudioNode', () => {
            expect(isAnyAudioNode({ a: 'fake AudioNode' })).to.be.true;
        });
    });
});
