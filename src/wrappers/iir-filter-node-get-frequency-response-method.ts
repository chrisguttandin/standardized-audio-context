import { Injectable } from '@angular/core';
import { createInvalidAccessError } from '../factories/invalid-access-error';
import { TNativeIIRFilterNode } from '../types';

@Injectable()
export class IIRFilterNodeGetFrequencyResponseMethodWrapper {

    public wrap (iIRFilterNode: TNativeIIRFilterNode) {
        iIRFilterNode.getFrequencyResponse = ((getFrequencyResponse) => {
            return (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) => {
                if ((frequencyHz.length !== magResponse.length) || (magResponse.length !== phaseResponse.length)) {
                    throw createInvalidAccessError();
                }

                return getFrequencyResponse.call(iIRFilterNode, frequencyHz, magResponse, phaseResponse);
            };
        })(iIRFilterNode.getFrequencyResponse);
    }

}

export const IIR_FILTER_NODE_GET_FREQUENCY_RESPONSE_METHOD_WRAPPER_PROVIDER = {
    deps: [ ],
    provide: IIRFilterNodeGetFrequencyResponseMethodWrapper
};
