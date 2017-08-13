import { Injectable } from '@angular/core';
import { NotSupportedErrorFactory } from '../factories/not-supported-error';
import { IIIRFilterNode } from '../interfaces';

@Injectable()
export class IIRFilterNodeGetFrequencyResponseMethodWrapper {

    constructor (private _notSupportedErrorFactory: NotSupportedErrorFactory) { }

    public wrap (iIRFilterNode: IIIRFilterNode) {
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
