import { OfflineAudioNodeProxy } from '../offline-audio-node';

class OfflineBiquadFilterNodeFakerProxy extends OfflineAudioNodeProxy {

    private _nativeNode;

    private _type;

    constructor ({ fakeNodeStore, nativeNode }) {
        super({
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fakeNodeStore,
            numberOfInputs: 1,
            numberOfOutputs: 1
        });

        this._nativeNode = nativeNode;
        this._type = nativeNode.type;
    }

    public get detune () {
        // @todo Fake a proper AudioParam.
        return {
            cancelScheduledValues: () => {}, // tslint:disable-line:no-empty
            defaultValue: 0,
            exponentialRampToValueAtTime: () => {}, // tslint:disable-line:no-empty
            linearRampToValueAtTime: () => {}, // tslint:disable-line:no-empty
            setTargetAtTime: () => {}, // tslint:disable-line:no-empty
            setValueCurveAtTime: () => {}, // tslint:disable-line:no-empty
            value: 0
        };
    }

    public get frequency () {
        // @todo Fake a proper AudioParam.
        return {
            cancelScheduledValues: () => {}, // tslint:disable-line:no-empty
            defaultValue: 350,
            exponentialRampToValueAtTime: () => {}, // tslint:disable-line:no-empty
            linearRampToValueAtTime: () => {}, // tslint:disable-line:no-empty
            setTargetAtTime: () => {}, // tslint:disable-line:no-empty
            setValueCurveAtTime: () => {}, // tslint:disable-line:no-empty
            value: 350
        };
    }

    public get gain () {
        // @todo Fake a proper AudioParam.
        return {
            cancelScheduledValues: () => {}, // tslint:disable-line:no-empty
            defaultValue: 0,
            exponentialRampToValueAtTime: () => {}, // tslint:disable-line:no-empty
            linearRampToValueAtTime: () => {}, // tslint:disable-line:no-empty
            setTargetAtTime: () => {}, // tslint:disable-line:no-empty
            setValueCurveAtTime: () => {}, // tslint:disable-line:no-empty
            value: 0
        };
    }

    public get Q () {
        // @todo Fake a proper AudioParam.
        return {
            cancelScheduledValues: () => {}, // tslint:disable-line:no-empty
            defaultValue: 1,
            exponentialRampToValueAtTime: () => {}, // tslint:disable-line:no-empty
            linearRampToValueAtTime: () => {}, // tslint:disable-line:no-empty
            setTargetAtTime: () => {}, // tslint:disable-line:no-empty
            setValueCurveAtTime: () => {}, // tslint:disable-line:no-empty
            value: 1
        };
    }

    public get type () {
        return this._type;
    }

    public set type (value) {
        this._type = value;
    }

    public getFrequencyResponse (frequencyHz, magResponse, phaseResponse) {
        return this._nativeNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
    }

}

export class OfflineBiquadFilterNodeFaker {

    private _node;

    private _proxy;

    private _sources;

    constructor ({ fakeNodeStore, nativeNode }) {
        this._node = null;
        this._proxy = new OfflineBiquadFilterNodeFakerProxy({ fakeNodeStore, nativeNode });
        this._sources = new Map();

        fakeNodeStore.set(this._proxy, this);
    }

    get proxy () {
        return this._proxy;
    }

    public render (offlineAudioContext) {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        const promises = [];

        this._node = offlineAudioContext.createBiquadFilter();

        this._node.type = this._proxy.type;

        for (const [ source, { input, output } ] of this._sources) {
            promises.push(source
                .render(offlineAudioContext)
                .then((node) => node.connect(this._node, output, input)));
        }

        return Promise
            .all(promises)
            .then(() => this._node);
    }

    public wire (source, output, input) {
        this._sources.set(source, { input, output });

        return this._proxy;
    }

    public unwire (source) {
        this._sources.delete(source);
    }

}

export class OfflineBiquadFilterNodeFakerFactory {

    public create ({ fakeNodeStore, nativeNode }) {
        return new OfflineBiquadFilterNodeFaker({
            fakeNodeStore,
            nativeNode
        });
    }

}
