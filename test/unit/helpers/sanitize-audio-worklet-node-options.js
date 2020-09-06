import { sanitizeAudioWorkletNodeOptions } from '../../../src/helpers/sanitize-audio-worklet-node-options';

describe('sanitizeAudioWorkletNodeOptions()', () => {
    describe('with a defined outputChannelCount property', () => {
        let options;

        beforeEach(() => {
            options = { channelCount: 4, numberOfInputs: 2, numberOfOutputs: 1, outputChannelCount: [12] };
        });

        it('should return an object with that outputChannelCount property', () => {
            expect(sanitizeAudioWorkletNodeOptions(options)).to.deep.equal(options);
        });
    });

    describe('without a defined outputChannelCount property', () => {
        describe('with exactly one input and one output', () => {
            let channelCount;
            let options;

            beforeEach(() => {
                channelCount = 4;
                options = { channelCount, numberOfInputs: 1, numberOfOutputs: 1 };
            });

            it('should return an object with the outputChannelCount property set to an array with a single element', () => {
                expect(sanitizeAudioWorkletNodeOptions(options)).to.deep.equal({ ...options, outputChannelCount: [channelCount] });
            });
        });

        describe('with more than one output', () => {
            let options;

            beforeEach(() => {
                options = { channelCount: 4, numberOfInputs: 1, numberOfOutputs: 3 };
            });

            it('should return an object with the outputChannelCount property set to an array with three elements', () => {
                expect(sanitizeAudioWorkletNodeOptions(options)).to.deep.equal({ ...options, outputChannelCount: [1, 1, 1] });
            });
        });
    });
});
