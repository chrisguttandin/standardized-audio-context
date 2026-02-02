// This example is copied from this article: https://developers.google.com/web/updates/2017/12/audio-worklet

class GainProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this.port.onmessage = (event) => {
            this.port.postMessage(event.data);
        };
    }

    // eslint-disable-next-line class-methods-use-this
    process([input], [output], { gain }) {
        for (const [channel, inputChannel] of input.entries()) {
            const outputChannel = output[channel];

            // eslint-disable-next-line unicorn/no-for-loop
            for (let i = 0; i < inputChannel.length; i += 1) {
                outputChannel[i] = inputChannel[i] * (gain.length === 1 ? gain[0] : gain[i]);
            }
        }

        return true;
    }
}

GainProcessor.parameterDescriptors = [
    {
        defaultValue: 1,
        name: 'gain'
    }
];

registerProcessor('gain-processor', GainProcessor);

// This is a comment which is meant to be the last line of the file with no following line break.
