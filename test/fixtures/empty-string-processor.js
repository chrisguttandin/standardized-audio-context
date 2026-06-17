// eslint-disable-next-line no-undef
class EmptyStringProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    // eslint-disable-next-line class-methods-use-this
    process() {
        return true;
    }
}

// eslint-disable-next-line no-undef
registerProcessor('', EmptyStringProcessor);
