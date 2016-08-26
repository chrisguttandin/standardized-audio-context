import { OfflineAudioNodeProxy } from '../offline-audio-node';

class OfflineBiquadFilterNodeFakerProxy extends OfflineAudioNodeProxy {

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

    get detune () { // eslint-disable-line class-methods-use-this
        // @todo Fake a proper AudioParam.
        return {
            cancelScheduledValues: () => {},
            defaultValue: 0,
            exponentialRampToValueAtTime: () => {},
            linearRampToValueAtTime: () => {},
            setTargetAtTime: () => {},
            setValueCurveAtTime: () => {},
            value: 0
        };
    }
    get frequency () { // eslint-disable-line class-methods-use-this
        // @todo Fake a proper AudioParam.
        return {
            cancelScheduledValues: () => {},
            defaultValue: 350,
            exponentialRampToValueAtTime: () => {},
            linearRampToValueAtTime: () => {},
            setTargetAtTime: () => {},
            setValueCurveAtTime: () => {},
            value: 350
        };
    }

    get gain () { // eslint-disable-line class-methods-use-this
        // @todo Fake a proper AudioParam.
        return {
            cancelScheduledValues: () => {},
            defaultValue: 0,
            exponentialRampToValueAtTime: () => {},
            linearRampToValueAtTime: () => {},
            setTargetAtTime: () => {},
            setValueCurveAtTime: () => {},
            value: 0
        };
    }

    get Q () { // eslint-disable-line class-methods-use-this
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

    get type () {
        return this._type;
    }

    set type (value) {
        this._type = value;
    }

    getFrequencyResponse (frequencyHz, magResponse, phaseResponse) {
        return this._nativeNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
    }

}

class OfflineBiquadFilterNodeFaker {

    constructor ({ fakeNodeStore, nativeNode }) {
        this._node = null;
        this._proxy = new OfflineBiquadFilterNodeFakerProxy({ fakeNodeStore, nativeNode });
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
        this._node = offlineAudioContext.createBiquadFilter();

        this._node.type = this._proxy.type;

        for (let [ source, { input, output } ] of this._sources) {
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

export class OfflineBiquadFilterNodeFakerFactory {

    create ({ fakeNodeStore, nativeNode }) { // eslint-disable-line class-methods-use-this
        return new OfflineBiquadFilterNodeFaker({
            fakeNodeStore,
            nativeNode
        });
    }

}
