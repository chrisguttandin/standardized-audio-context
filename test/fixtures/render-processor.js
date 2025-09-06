class RenderProcessor extends AudioWorkletProcessor {
    constructor({ processorOptions: { length } }) {
        super();

        this._channelData = new Float32Array(length);
        // eslint-disable-next-line no-undef
        this._currentFrame = currentFrame;
        this._length = length;
        // eslint-disable-next-line no-undef
        this._startFrame = currentFrame;

        this.port.postMessage(this._startFrame);
    }

    process(inputs) {
        // Bug #204: Chrome sometimes forgets to advance currentFrame.
        // eslint-disable-next-line no-undef
        if (this._currentFrame < currentFrame) {
            this.port.postMessage(null);
            this.port.close();

            return false;
        }

        const channelDataIndex = this._currentFrame - this._startFrame;
        const numberOfSamples = Math.min(this._length - channelDataIndex, 128);

        this._channelData.set(
            (inputs[0][0]?.length ?? 0) === 0
                ? new Float32Array(numberOfSamples)
                : numberOfSamples === inputs[0][0].length
                  ? inputs[0][0]
                  : inputs[0][0].slice(0, numberOfSamples),
            channelDataIndex
        );

        if (channelDataIndex + numberOfSamples === this._length) {
            this.port.postMessage(this._channelData, [this._channelData.buffer]);
            this.port.close();

            return false;
        }

        this._currentFrame += 128;

        return true;
    }
}

registerProcessor('render-processor', RenderProcessor);
