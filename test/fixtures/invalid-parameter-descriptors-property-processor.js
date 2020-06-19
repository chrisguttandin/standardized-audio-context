class InvalidParameterDescriptorsPropertyProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    // eslint-disable-next-line class-methods-use-this
    process() {
        return true;
    }
}

InvalidParameterDescriptorsPropertyProcessor.parameterDescriptors = null;

registerProcessor('invalid-parameter-descriptors-property-processor', InvalidParameterDescriptorsPropertyProcessor);
