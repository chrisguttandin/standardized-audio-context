import { OfflineAudioNodeProxy } from '../offline-audio-node';

class OfflineGainNodeFakerProxy extends OfflineAudioNodeProxy {

    constructor ({ fakeNodeStore }) {
        super({
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fakeNodeStore,
            numberOfInputs: 1,
            numberOfOutputs: 1
        });
    }

    public get gain () {
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

}

export class OfflineGainNodeFaker {

    private _node;

    private _proxy;

    private _sources;

    constructor ({ fakeNodeStore }) {
        this._node = null;
        this._proxy = new OfflineGainNodeFakerProxy({ fakeNodeStore });
        this._sources = new Map();

        fakeNodeStore.set(this._proxy, this);
    }

    public get proxy () {
        return this._proxy;
    }

    public render (offlineAudioContext) {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        const promises = [];

        this._node = offlineAudioContext.createGain();

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

export class OfflineGainNodeFakerFactory {

    public create ({ fakeNodeStore }) {
        return new OfflineGainNodeFaker({ fakeNodeStore });
    }

}
