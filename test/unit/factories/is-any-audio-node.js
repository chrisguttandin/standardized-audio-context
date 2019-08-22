import { createIsAnyAudioNode } from '../../../src/factories/is-any-audio-node';

describe('isAnyAudioNode()', () => {

    let audioNodeConstructor;
    let audioNodeStore;
    let isAnyAudioNode;

    beforeEach(() => {
        class AudioNode { };
        const window = { AudioNode };

        audioNodeConstructor = window.AudioNode;
        audioNodeStore = new WeakMap();

        isAnyAudioNode = createIsAnyAudioNode(audioNodeStore, window);
    });

    describe('without any AudioNode in the store', () => {

        it('should not identify any AudioNode', () => {
            expect(isAnyAudioNode({ a: 'fake AudioNode' })).to.be.false;
        });

    });

    describe('with an AudioNode in the store', () => {

        let audioNode;

        beforeEach(() => {
            audioNode = { a: 'fake AudioNode' };

            audioNodeStore.set(audioNode, { a: 'fake native AudioNode' });
        });

        it('should identify the stored AudioNode', () => {
            expect(isAnyAudioNode(audioNode)).to.be.true;
        });

        it('should not identify any other AudioNode', () => {
            expect(isAnyAudioNode({ another: 'fake AudioNode' })).to.be.false;
        });

    });

    describe('with a native AudioNode', () => {

        let gainNode;

        beforeEach(() => {
            gainNode = new (class extends audioNodeConstructor { })();
        });

        it('should identify a native AudioNode', () => {
            expect(isAnyAudioNode(gainNode)).to.be.true;
        });

    });

});
