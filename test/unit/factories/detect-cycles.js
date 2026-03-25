import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDetectCycles } from '../../../src/factories/detect-cycles';

describe('detectCycles()', () => {
    let audioParamAudioNodeStore;
    let detectCycles;
    let getAudioNodeConnections;
    let getValueForKey;

    beforeEach(() => {
        audioParamAudioNodeStore = new WeakMap();
        getAudioNodeConnections = vi.fn();
        getValueForKey = () => {};

        detectCycles = createDetectCycles(audioParamAudioNodeStore, getAudioNodeConnections, getValueForKey);
    });

    describe('without any connection', () => {
        beforeEach(() => {
            const outputs = new Set();

            getAudioNodeConnections.mockReturnValue({ outputs });
        });

        describe('with two different AudioNodes', () => {
            it('should detect no cycle', () => {
                expect(detectCycles([{ context: 'a fake AudioContext' }], { context: 'a fake AudioContext' })).to.deep.equal([]);
            });
        });

        describe('with one AudioNode', () => {
            let audioNode;

            beforeEach(() => {
                audioNode = { context: 'a fake AudioContext' };
            });

            it('should detect a cycle', () => {
                expect(detectCycles([audioNode], audioNode)).to.deep.equal([[audioNode]]);
            });
        });
    });

    describe('with an existing connection to a regular AudioNode', () => {
        let audioNode;
        let anotherAudioNode;

        beforeEach(() => {
            audioNode = { context: 'a fake AudioContext' };
            anotherAudioNode = { context: 'a fake AudioContext' };

            const outputs = new Set([[audioNode, 1, 1]]);

            getAudioNodeConnections.mockReturnValue({ outputs });
        });

        it('should detect a cycle', () => {
            expect(detectCycles([audioNode], anotherAudioNode)).to.deep.equal([[audioNode, anotherAudioNode]]);
        });
    });

    describe('with an existing connection to a DelayNode', () => {
        let audioNode;
        let delayNode;

        beforeEach(() => {
            audioNode = { context: 'a fake AudioContext' };
            delayNode = { context: 'a fake AudioContext', delayTime: 'a fake delayTime AudioParam' };

            const outputs = new Set([[delayNode, 1, 1]]);

            getAudioNodeConnections.mockReturnValue({ outputs });
        });

        it('should detect no cycle', () => {
            expect(detectCycles([delayNode], audioNode)).to.deep.equal([]);
        });
    });

    describe('with an existing connection from a DelayNode', () => {
        let audioNode;
        let delayNode;

        beforeEach(() => {
            audioNode = { context: 'a fake AudioContext' };
            delayNode = { context: 'a fake AudioContext', delayTime: 'a fake delayTime AudioParam' };

            const outputs = new Set([[audioNode, 1, 1]]);

            getAudioNodeConnections.mockReturnValue({ outputs });
        });

        it('should detect no cycle', () => {
            expect(detectCycles([audioNode], delayNode)).to.deep.equal([]);
        });
    });

    describe('with various connections to other regular AudioNodes', () => {
        let audioNode;
        let anotherAudioNode;
        let yetAnotherAudioNode;

        beforeEach(() => {
            audioNode = { context: 'a fake AudioContext' };
            anotherAudioNode = { any: 'unique property', context: 'a fake AudioContext' };
            yetAnotherAudioNode = { any: 'other unique property', context: 'a fake AudioContext' };

            const outputsOfAnotherAudioNode = new Set([
                [audioNode, 1, 1],
                [yetAnotherAudioNode, 1, 1]
            ]);
            const outputsOfYetAnotherAudioNode = new Set([[audioNode, 1, 1]]);

            getAudioNodeConnections.mockImplementation((arg) => {
                if (arg === anotherAudioNode) {
                    return { outputs: outputsOfAnotherAudioNode };
                }

                if (arg === yetAnotherAudioNode) {
                    return { outputs: outputsOfYetAnotherAudioNode };
                }
            });
        });

        it('should detect two cycles', () => {
            expect(detectCycles([audioNode], anotherAudioNode)).to.deep.equal([
                [audioNode, anotherAudioNode],
                [audioNode, anotherAudioNode, yetAnotherAudioNode]
            ]);
        });
    });

    describe('with an existing cycle', () => {
        let audioNode;
        let anotherAudioNode;
        let yetAnotherAudioNode;

        beforeEach(() => {
            audioNode = { context: 'a fake AudioContext' };
            anotherAudioNode = { any: 'unique property', context: 'a fake AudioContext' };
            yetAnotherAudioNode = { any: 'other unique property', context: 'a fake AudioContext' };

            const outputsOfAnotherAudioNode = new Set([[yetAnotherAudioNode, 1, 1]]);
            const outputsOfYetAnotherAudioNode = new Set([[anotherAudioNode, 1, 1]]);

            getAudioNodeConnections.mockImplementation((arg) => {
                if (arg === anotherAudioNode) {
                    return { outputs: outputsOfAnotherAudioNode };
                }

                if (arg === yetAnotherAudioNode) {
                    return { outputs: outputsOfYetAnotherAudioNode };
                }
            });
        });

        it('should detect no cycle', () => {
            expect(detectCycles([audioNode], anotherAudioNode)).to.deep.equal([]);
        });
    });
});
