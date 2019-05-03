import { constant } from './constant.js'; // eslint-disable-line node/file-extension-in-import

class GibberishProcessor extends AudioWorkletProcessor {

    process (inputs, outputs) { // eslint-disable-line class-methods-use-this
        const output = outputs[0];
        const length = outputs[0][0].length;

        for (let i = 0; i < length; i += 1) {
            output[0][ i ] = -1 + (Math.random() * constant);
            output[1][ i ] = -1 + (Math.random() * constant);
        }

        return true;
    }

}

registerProcessor('gibberish-processor', GibberishProcessor);
