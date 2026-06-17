// eslint-disable-next-line no-undef
class DiscontinuityDetectorProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this._lastSample = 0;
        this._isRunning = false;
    }

    process(inputs) {
        if (inputs.length > 0 && inputs[0].length > 0 && inputs[0][0].length > 0) {
            for (let i = 0; i < 128; i += 1) {
                const sample = inputs[0][0][i];

                if (sample === 0) {
                    continue;
                }

                if (!this._isRunning) {
                    this._isRunning = true;

                    this.port.postMessage('running');
                }

                if (sample - this._lastSample > 2) {
                    this.port.postMessage('discontinuity');
                    this.port.close();

                    return false;
                }

                this._lastSample = sample;
            }
        }

        return true;
    }
}

// eslint-disable-next-line no-undef
registerProcessor('discontinuity-detector-processor', DiscontinuityDetectorProcessor);
