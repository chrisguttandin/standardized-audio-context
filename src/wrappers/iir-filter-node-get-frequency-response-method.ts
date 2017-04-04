import { Inject, Injectable } from '@angular/core';
import { NotSupportedErrorFactory } from '../factories/not-supported-error';

@Injectable()
export class IIRFilterNodeGetFrequencyResponseMethodWrapper {

    constructor (@Inject(NotSupportedErrorFactory) private _notSupportedErrorFactory) { }

    public wrap (iIRFilterNode) {
        iIRFilterNode.getFrequencyResponse = ((getFrequencyResponse) => {
            return (frequencyHz, magResponse, phaseResponse) => {
                if (magResponse.length === 0 || phaseResponse.length === 0) {
                    throw this._notSupportedErrorFactory.create();
                }

                return getFrequencyResponse.call(iIRFilterNode, frequencyHz, magResponse, phaseResponse);
            };
        })(iIRFilterNode.getFrequencyResponse);
    }

}
