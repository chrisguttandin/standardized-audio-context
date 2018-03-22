class GainProcessor extends AudioWorkletProcessor { // eslint-disable-line no-undef

    constructor () {
        super();
    }

    process () { // eslint-disable-line class-methods-use-this
        return true;
    }

}

GainProcessor.parameterDescriptors = [ ];

registerProcessor('gain-processor', GainProcessor); // eslint-disable-line no-undef
