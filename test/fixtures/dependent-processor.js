class DependentProcessor extends AudioWorkletProcessor {

    constructor () {
        super();

        this.port.onmessage = () => {
            const typeOfLibrary = typeof library;

            this.port.postMessage({ typeOfLibrary });
        };
    }

    process () { // eslint-disable-line class-methods-use-this
        return true;
    }

}

DependentProcessor.parameterDescriptors = [ ];

registerProcessor('dependent-processor', DependentProcessor);
