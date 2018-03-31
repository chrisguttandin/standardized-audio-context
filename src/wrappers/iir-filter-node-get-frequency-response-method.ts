import { createInvalidAccessError } from '../factories/invalid-access-error';
import { TNativeIIRFilterNode } from '../types';

export const wrapIIRFilterNodeGetFrequencyResponseMethod = (iIRFilterNode: TNativeIIRFilterNode): void => {
    iIRFilterNode.getFrequencyResponse = ((getFrequencyResponse) => {
        return (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) => {
            if ((frequencyHz.length !== magResponse.length) || (magResponse.length !== phaseResponse.length)) {
                throw createInvalidAccessError();
            }

            return getFrequencyResponse.call(iIRFilterNode, frequencyHz, magResponse, phaseResponse);
        };
    })(iIRFilterNode.getFrequencyResponse);
};
