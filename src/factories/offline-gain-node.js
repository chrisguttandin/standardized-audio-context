import { OfflineAudioNodeProxy } from '../offline-audio-node';

class OfflineGainNodeFakerProxy extends OfflineAudioNodeProxy {

    constructor ({ fakeNodeStore }) {
        super({
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fakeNodeStore: fakeNodeStore,
            numberOfInputs: 1,
            numberOfOutputs: 1
        });
    }

    get gain () {
        // @todo Fake a proper AudioParam.
        return {
            cancelScheduledValues: () => {},
            defaultValue: 1,
            exponentialRampToValueAtTime: () => {},
            linearRampToValueAtTime: () => {},
            setTargetAtTime: () => {},
            setValueCurveAtTime: () => {},
            value: 1
        };
    }

}

class OfflineGainNodeFaker {

    constructor ({ fakeNodeStore }) {
        this._node = null;
        this._proxy = new OfflineGainNodeFakerProxy({ fakeNodeStore });
        this._sources = new Map();

        fakeNodeStore.set(this._proxy, this);
    }

    get proxy () {
        return this._proxy;
    }

    render (offlineAudioContext) {
        var promises;

        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        promises = [];
        this._node = offlineAudioContext.createGain();

        for (let [ source, { input, output }] of this._sources) {
            promises.push(source
                .render(offlineAudioContext)
                .then((node) => node.connect(this._node, output, input)));
        }

        return Promise
            .all(promises)
            .then(() => this._node);
    }

    wire (source, output, input) {
        this._sources.set(source, { input, output });

        return this._proxy;
    }

    unwire (source) {
        this._sources.delete(source);
    }

}

export class OfflineGainNodeFakerFactory {

    create ({ fakeNodeStore }) {
        return new OfflineGainNodeFaker({ fakeNodeStore });
    }

}
