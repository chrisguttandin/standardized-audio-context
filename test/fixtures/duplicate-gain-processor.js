class GainProcessor extends AudioWorkletProcessor {

    constructor () {
        super();
    }

    process () { // eslint-disable-line class-methods-use-this
        return true;
    }

}

GainProcessor.parameterDescriptors = [ ];

registerProcessor('gain-processor', GainProcessor);
