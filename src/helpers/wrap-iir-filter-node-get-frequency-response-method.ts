import { createInvalidAccessError } from '../factories/invalid-access-error';
import { TNativeIIRFilterNode } from '../types';

export const wrapIIRFilterNodeGetFrequencyResponseMethod = (nativeIIRFilterNode: TNativeIIRFilterNode): void => {
    nativeIIRFilterNode.getFrequencyResponse = ((getFrequencyResponse) => {
        return (
            frequencyHz: Float32Array<ArrayBuffer>,
            magResponse: Float32Array<ArrayBuffer>,
            phaseResponse: Float32Array<ArrayBuffer>
        ) => {
            if (frequencyHz.length !== magResponse.length || magResponse.length !== phaseResponse.length) {
                throw createInvalidAccessError();
            }

            return getFrequencyResponse.call(nativeIIRFilterNode, frequencyHz, magResponse, phaseResponse);
        };
    })(nativeIIRFilterNode.getFrequencyResponse);
};
