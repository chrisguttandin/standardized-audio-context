class EmptyStringProcessor extends AudioWorkletProcessor {

    constructor () {
        super();
    }

    process () { // eslint-disable-line class-methods-use-this
        return true;
    }

}

registerProcessor('', EmptyStringProcessor);
