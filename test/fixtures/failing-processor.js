class FailingProcessor extends AudioWorkletProcessor {

    constructor () {
        super();
    }

    process () { // eslint-disable-line class-methods-use-this
        throw new Error('This is an error thrown inside the process() method.');

        return true;
    }

}

registerProcessor('failing-processor', FailingProcessor);
