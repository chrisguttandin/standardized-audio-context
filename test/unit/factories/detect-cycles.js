import { createDetectCycles } from '../../../src/factories/detect-cycles';

describe('detectCycles()', () => {

    let audioParamAudioNodeStore;
    let createNotSupportedError;
    let detectCycles;
    let getAudioNodeConnections;
    let getValueForKey;
    let outputs;

    beforeEach(() => {
        audioParamAudioNodeStore = new WeakMap();
        createNotSupportedError = () => { throw new Error('fake error'); };
        outputs = new Set();
        getAudioNodeConnections = () => ({ outputs });
        getValueForKey = () => { };

        detectCycles = createDetectCycles(audioParamAudioNodeStore, createNotSupportedError, getAudioNodeConnections, getValueForKey);
    });

    describe('without any connection', () => {

        it('should detect no cycle', () => {
            expect(detectCycles({ context: 'a fake AudioContext' }, { context: 'a fake AudioContext' })).to.be.false;
        });

    });

    describe('with an existing connection to a regular AudioNode', () => {

        let audioNode;
        let anotherAudioNodeb;

        beforeEach(() => {
            audioNode = { context: 'a fake AudioContext' };
            anotherAudioNodeb = { context: 'a fake AudioContext' };

            outputs.add([ audioNode, 1, 1 ]);
        });

        it('should detect a cycle', () => {
            expect(() => detectCycles(audioNode, anotherAudioNodeb)).to.throw('fake error');
        });

    });

    describe('with an existing connection to a DelayNode', () => {

        let audioNode;
        let delayNode;

        beforeEach(() => {
            audioNode = { context: 'a fake AudioContext' };
            delayNode = { context: 'a fake AudioContext', delayTime: 'a fake delayTime AudioParam' };

            outputs.add([ delayNode, 1, 1 ]);
        });

        it('should detect no cycle', () => {
            expect(detectCycles(delayNode, audioNode)).to.be.true;
        });

    });

    describe('with an existing connection from a DelayNode', () => {

        let audioNode;
        let delayNode;

        beforeEach(() => {
            audioNode = { context: 'a fake AudioContext' };
            delayNode = { context: 'a fake AudioContext', delayTime: 'a fake delayTime AudioParam' };

            outputs.add([ audioNode, 1, 1 ]);
        });

        it('should detect no cycle', () => {
            expect(detectCycles(audioNode, delayNode)).to.be.true;
        });

    });

});
