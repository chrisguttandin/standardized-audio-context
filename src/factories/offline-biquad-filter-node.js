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
    }

    get detune () {
        return this._nativeNode.detune;
    }

    get gain () {
        return this._nativeNode.gain;
    }

    get frequency () {
        return this._nativeNode.frequency;
    }

    get Q () {
        return this._nativeNode.Q;
    }

    get type () {
        return this._nativeNode.type;
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
        this._node = this._nativeNode;

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

    create ({ fakeNodeStore, nativeNode }) {
        return new OfflineBiquadFilterNodeFaker({
            fakeNodeStore,
            nativeNode
        });
    }

}
