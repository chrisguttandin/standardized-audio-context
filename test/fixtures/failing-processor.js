class FailingProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    // eslint-disable-next-line class-methods-use-this
    process() {
        throw new Error('This is an error thrown inside the process() method.');

        return true;
    }
}

registerProcessor('failing-processor', FailingProcessor);
