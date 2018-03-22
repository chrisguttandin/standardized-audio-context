class EmptyStringProcessor extends AudioWorkletProcessor { // eslint-disable-line no-undef

    constructor () {
        super();
    }

    process () { // eslint-disable-line class-methods-use-this
        return true;
    }

}

EmptyStringProcessor.parameterDescriptors = [ ];

registerProcessor('', EmptyStringProcessor); // eslint-disable-line no-undef
