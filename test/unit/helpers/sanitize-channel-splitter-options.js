import { beforeEach, describe, expect, it } from 'vitest';
import { sanitizeChannelSplitterOptions } from '../../../src/helpers/sanitize-channel-splitter-options';

describe('sanitizeChannelSplitterOptions()', () => {
    let numberOfOutputs;
    let options;

    beforeEach(() => {
        numberOfOutputs = 4;
        options = { channelCount: 2, numberOfOutputs };
    });

    it('should return an object with the channelCount property set to the value of the numberOfOutputs property', () => {
        expect(sanitizeChannelSplitterOptions(options)).to.deep.equal({ ...options, channelCount: numberOfOutputs });
    });
});
