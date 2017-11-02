import { TNativeAnalyserNode } from '../types';

export class AnalyserNodeGetFloatTimeDomainDataMethodWrapper {

    public wrap (analyserNode: TNativeAnalyserNode) {
        analyserNode.getFloatTimeDomainData = (array: Float32Array) => {
            const byteTimeDomainData = new Uint8Array(array.length);

            analyserNode.getByteTimeDomainData(byteTimeDomainData);

            const length = Math.max(byteTimeDomainData.length, analyserNode.fftSize);

            for (let i = 0; i < length; i += 1) {
                array[i] = (byteTimeDomainData[i] - 128) * 0.0078125;
            }

            return array;
        };
    }

}

export const ANALYSER_NODE_GET_FLOAT_TIME_DOMAIN_DATA_METHOD_WRAPPER_PROVIDER = {
    deps: [ ],
    provide: AnalyserNodeGetFloatTimeDomainDataMethodWrapper
};
