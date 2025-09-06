class DelayedFramesDetectorProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this._numberOfDelayedFrames = 0;
        this._numberOfSilentFrames = 0;
    }

    process(inputs) {
        if (inputs.length > 0 && inputs[0].length > 0 && inputs[0][0].length > 0) {
            if (this._numberOfDelayedFrames === 0) {
                for (let i = 0; i < 128; i += 1) {
                    if (inputs[0][0][i] === 1) {
                        this._numberOfDelayedFrames = 128 - i;

                        return true;
                    }
                }

                this._numberOfSilentFrames += 128;
            } else {
                for (let i = 0; i < 128; i += 1) {
                    if (inputs[0][0][i] === 2) {
                        this.port.postMessage(this._numberOfDelayedFrames + i);
                        this.port.close();

                        return false;
                    }
                }

                this._numberOfDelayedFrames += 128;
            }
        }

        return true;
    }
}

registerProcessor('delayed-frames-detector-processor', DelayedFramesDetectorProcessor);
