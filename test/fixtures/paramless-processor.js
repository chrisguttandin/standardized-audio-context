class ParamlessProcessor extends AudioWorkletProcessor {

    constructor () {
        super();
    }

    process () { // eslint-disable-line class-methods-use-this
        return true;
    }

}

registerProcessor('paramless-processor', ParamlessProcessor);
