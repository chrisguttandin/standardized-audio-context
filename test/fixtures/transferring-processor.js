class TransferringProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        this.port.postMessage({ inputs, outputs, parameters }, [
            ...inputs.reduce((buffers, input) => [...buffers, ...input.map((channelData) => channelData.buffer)], []),
            ...outputs.reduce((buffers, output) => [...buffers, ...output.map((channelData) => channelData.buffer)], []),
            ...Array.from(Object.values(parameters)).map((parameter) => parameter.buffer)
        ]);

        return true;
    }
}

registerProcessor('transferring-processor', TransferringProcessor);
