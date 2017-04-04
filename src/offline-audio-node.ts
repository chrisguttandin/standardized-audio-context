// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare var DOMException: {
    new (message: string, name: string): DOMException;
};

export class OfflineAudioNodeProxy {

    private _channelCountMode;

    private _channelInterpretation;

    private _fakeNodeStore;

    private _numberOfInputs;

    private _numberOfOutputs;

    constructor ({
        channelCountMode,
        channelInterpretation,
        fakeNodeStore,
        numberOfInputs,
        numberOfOutputs
    }: { channelCountMode?, channelInterpretation?, fakeNodeStore, numberOfInputs?, numberOfOutputs? }) {
        this._channelCountMode = channelCountMode;
        this._channelInterpretation = channelInterpretation;
        this._fakeNodeStore = fakeNodeStore;
        this._numberOfInputs = numberOfInputs;
        this._numberOfOutputs = numberOfOutputs;
    }

    public get channelCountMode () {
        return this._channelCountMode;
    }

    public set channelCountMode (value) {
        this._channelCountMode = value;
    }

    public get channelInterpretation () {
        return this._channelInterpretation;
    }

    public set channelInterpretation (value) {
        this._channelInterpretation = value;
    }

    public get numberOfInputs () {
        return this._numberOfInputs;
    }

    public set numberOfInputs (value) {
        this._numberOfInputs = value;
    }

    public get numberOfOutputs () {
        return this._numberOfOutputs;
    }

    public set numberOfOutputs (value) {
        this._numberOfOutputs = value;
    }

    public connect (destination, output = 0, input = 0) {
        const faker = this._fakeNodeStore.get(destination);

        if (faker === undefined) {
            let exception;

            try {
                exception = new DOMException('', 'InvalidAccessError');
            } catch (err) {
                exception = new Error();

                exception.code = 15;
                exception.name = 'InvalidAccessError';
            }

            throw exception;
        }

        return faker.wire(this._fakeNodeStore.get(this), output, input);
    }

    public disconnect (destination) {
        const faker = this._fakeNodeStore.get(destination);

        return faker.unwire(this._fakeNodeStore.get(this));
    }

}
