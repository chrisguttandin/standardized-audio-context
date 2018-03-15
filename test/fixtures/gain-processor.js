// This example is copied from this article: https://developers.google.com/web/updates/2017/12/audio-worklet

class GainProcessor extends AudioWorkletProcessor { // eslint-disable-line no-undef

    constructor () {
        super();
    }

    process ([ input ], [ output ], { gain }) { // eslint-disable-line class-methods-use-this
        for (let channel = 0; channel < input.length; channel += 1) {
            const inputChannel = input[channel];
            const outputChannel = output[channel];

            for (let i = 0; i < inputChannel.length; i += 1) {
                outputChannel[i] = inputChannel[i] * gain[i];
            }
        }

        return true;
    }

}

GainProcessor.parameterDescriptors = [ {
    defaultValue: 1,
    name: 'gain'
} ];

registerProcessor('gain-processor', GainProcessor); // eslint-disable-line no-undef
