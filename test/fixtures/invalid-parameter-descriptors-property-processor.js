class InvalidParameterDescriptorsPropertyProcessor extends AudioWorkletProcessor {

    constructor () {
        super();
    }

    process () { // eslint-disable-line class-methods-use-this
        return true;
    }

}

InvalidParameterDescriptorsPropertyProcessor.parameterDescriptors = null;

registerProcessor('invalid-parameter-descriptors-property-processor', InvalidParameterDescriptorsPropertyProcessor);
