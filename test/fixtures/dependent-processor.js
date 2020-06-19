class DependentProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this.port.onmessage = () => {
            const typeOfLibrary = typeof library;

            this.port.postMessage({ typeOfLibrary });
        };
    }

    // eslint-disable-next-line class-methods-use-this
    process() {
        return true;
    }
}

registerProcessor('dependent-processor', DependentProcessor);
