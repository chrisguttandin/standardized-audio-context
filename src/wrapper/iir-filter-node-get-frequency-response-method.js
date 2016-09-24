import { Inject } from '@angular/core';
import { NotSupportedErrorFactory } from '../factories/not-supported-error';

export class IIRFilterNodeGetFrequencyResponseMethodWrapper {

    constructor (notSupportedErrorFactory) {
        this._notSupportedErrorFactory = notSupportedErrorFactory;
    }

    wrap (iIRFilterNode) {
        var notSupportedErrorFactory = this._notSupportedErrorFactory;

        iIRFilterNode.getFrequencyResponse = (function (getFrequencyResponse) {
            return function (frequencyHz, magResponse, phaseResponse) {
                if (magResponse.length === 0 || phaseResponse.length === 0) {
                    throw notSupportedErrorFactory.create();
                }

                return getFrequencyResponse.call(iIRFilterNode, frequencyHz, magResponse, phaseResponse);
            };
        }(iIRFilterNode.getFrequencyResponse));

        return iIRFilterNode;
    }

}

IIRFilterNodeGetFrequencyResponseMethodWrapper.parameters = [ [ new Inject(NotSupportedErrorFactory) ] ];
