class FailingProcessor extends AudioWorkletProcessor { // eslint-disable-line no-undef

    constructor () {
        super();
    }

    process () { // eslint-disable-line class-methods-use-this
        throw new Error('This is an error thrown inside the process() method.');

        return true;
    }

}

FailingProcessor.parameterDescriptors = [ ];

registerProcessor('failing-processor', FailingProcessor); // eslint-disable-line no-undef
