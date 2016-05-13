export class OfflineAudioNodeProxy {

    constructor ({ channelCountMode, channelInterpretation, fakeNodeStore, numberOfInputs, numberOfOutputs }) {
        this._channelCountMode = channelCountMode;
        this._channelInterpretation = channelInterpretation;
        this._fakeNodeStore = fakeNodeStore;
        this._numberOfInputs = numberOfInputs;
        this._numberOfOutputs = numberOfOutputs;
    }

    get channelCountMode () {
        return this._channelCountMode;
    }

    set channelCountMode (value) {
        this._channelCountMode = value;
    }

    get channelInterpretation () {
        return this._channelInterpretation;
    }

    set channelInterpretation (value) {
        this._channelInterpretation = value;
    }

    get numberOfInputs () {
        return this._numberOfInputs;
    }

    set numberOfInputs (value) {
        this._numberOfInputs = value;
    }

    get numberOfOutputs () {
        return this._numberOfOutputs;
    }

    set numberOfOutputs (value) {
        this._numberOfOutputs = value;
    }

    connect (destination, output = 0, input = 0) {
        var faker = this._fakeNodeStore.get(destination);

        return faker.wire(this._fakeNodeStore.get(this), output, input);
    }

    disconnect (destination) {
        var faker = this._fakeNodeStore.get(destination);

        return faker.unwire(this._fakeNodeStore.get(this));
    }

}
