import { Injectable } from '@angular/core';
import { NotSupportedErrorFactory } from '../factories/not-supported-error';
import { TNativeIIRFilterNode } from '../types';

@Injectable()
export class IIRFilterNodeGetFrequencyResponseMethodWrapper {

    constructor (private _notSupportedErrorFactory: NotSupportedErrorFactory) { }

    public wrap (iIRFilterNode: TNativeIIRFilterNode) {
        iIRFilterNode.getFrequencyResponse = ((getFrequencyResponse) => {
            return (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) => {
                if (magResponse.length === 0 || phaseResponse.length === 0) {
                    throw this._notSupportedErrorFactory.create();
                }

                return getFrequencyResponse.call(iIRFilterNode, frequencyHz, magResponse, phaseResponse);
            };
        })(iIRFilterNode.getFrequencyResponse);
    }

}

export const IIR_FILTER_NODE_GET_FREQUENCY_RESPONSE_METHOD_WRAPPER_PROVIDER = {
    deps: [ NotSupportedErrorFactory ],
    provide: IIRFilterNodeGetFrequencyResponseMethodWrapper
};
