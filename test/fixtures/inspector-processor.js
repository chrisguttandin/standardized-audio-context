class InspectorProcessor extends AudioWorkletProcessor { // eslint-disable-line no-undef

    constructor () {
        super();

        this.port.onmessage = () => {
            const typeOfGlobal = typeof global;
            const typeOfSelf = typeof self;
            const typeOfWindow = typeof window;

            this.port.postMessage({ currentTime, sampleRate, typeOfGlobal, typeOfSelf, typeOfWindow }); // eslint-disable-line no-undef
        };
    }

    process () { // eslint-disable-line class-methods-use-this
        return true;
    }

}

InspectorProcessor.parameterDescriptors = [ ];

registerProcessor('inspector-processor', InspectorProcessor); // eslint-disable-line no-undef
