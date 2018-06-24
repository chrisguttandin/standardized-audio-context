class InspectorProcessor extends AudioWorkletProcessor {

    constructor (options) {
        super();

        this.port.onmessage = () => {
            const typeOfGlobal = typeof global;
            const typeOfSelf = typeof self;
            const typeOfWindow = typeof window;

            this.port.postMessage({ currentFrame, currentTime, options, sampleRate, typeOfGlobal, typeOfSelf, typeOfWindow }); // eslint-disable-line no-undef
        };
    }

    process (inputs, outputs, parameters) {
        this.port.postMessage({ inputs, outputs, parameters });

        return true;
    }

}

InspectorProcessor.parameterDescriptors = [ {
    defaultValue: 1,
    name: 'gain'
} ];

registerProcessor('inspector-processor', InspectorProcessor);
