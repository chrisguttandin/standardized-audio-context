class ParamlessProcessor extends AudioWorkletProcessor { // eslint-disable-line no-undef

    constructor () {
        super();
    }

    process () { // eslint-disable-line class-methods-use-this
        return true;
    }

}

registerProcessor('paramless-processor', ParamlessProcessor); // eslint-disable-line no-undef
