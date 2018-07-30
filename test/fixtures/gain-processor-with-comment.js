// This example is copied from this article: https://developers.google.com/web/updates/2017/12/audio-worklet

class GainProcessor extends AudioWorkletProcessor {

    constructor () {
        super();

        this.port.onmessage = (event) => {
            this.port.postMessage(event.data);
        };
    }

    process ([ input ], [ output ], { gain }) { // eslint-disable-line class-methods-use-this
        for (let channel = 0; channel < input.length; channel += 1) {
            const inputChannel = input[channel];
            const outputChannel = output[channel];

            for (let i = 0; i < inputChannel.length; i += 1) {
                outputChannel[i] = inputChannel[i] * ((gain.length === 1) ? gain[0] : gain[i]);
            }
        }

        return true;
    }

}

GainProcessor.parameterDescriptors = [ {
    defaultValue: 1,
    name: 'gain'
} ];

registerProcessor('gain-processor', GainProcessor);

// This is a comment which is meant to be the last line of the file with no following line break.