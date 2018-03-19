import { Injectable } from '@angular/core';
import { InvalidAccessErrorFactory } from '../factories/invalid-access-error';
import { TNativeIIRFilterNode } from '../types';

@Injectable()
export class IIRFilterNodeGetFrequencyResponseMethodWrapper {

    constructor (private _invalidAccessErrorFactory: InvalidAccessErrorFactory) { }

    public wrap (iIRFilterNode: TNativeIIRFilterNode) {
        iIRFilterNode.getFrequencyResponse = ((getFrequencyResponse) => {
            return (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) => {
                if ((frequencyHz.length !== magResponse.length) || (magResponse.length !== phaseResponse.length)) {
                    throw this._invalidAccessErrorFactory.create();
                }

                return getFrequencyResponse.call(iIRFilterNode, frequencyHz, magResponse, phaseResponse);
            };
        })(iIRFilterNode.getFrequencyResponse);
    }

}

export const IIR_FILTER_NODE_GET_FREQUENCY_RESPONSE_METHOD_WRAPPER_PROVIDER = {
    deps: [ InvalidAccessErrorFactory ],
    provide: IIRFilterNodeGetFrequencyResponseMethodWrapper
};
