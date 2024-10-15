class RenderProcessor extends AudioWorkletProcessor {
    constructor({ processorOptions: { length, startFrame } }) {
        super();

        this._length = length;
        this._startFrame = startFrame;
    }

    process(inputs) {
        // eslint-disable-next-line no-undef
        if (this._startFrame === currentFrame) {
            this.port.postMessage(inputs[0][0]?.slice(0, this._length) ?? new Float32Array(this._length));
            this.port.close();

            return false;
        }

        // eslint-disable-next-line no-undef
        if (this._startFrame !== null && this._startFrame < currentFrame) {
            this.port.postMessage(null);
            this.port.close();

            return false;
        }

        return true;
    }
}

registerProcessor('render-processor', RenderProcessor);
