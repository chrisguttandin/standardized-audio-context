import { OfflineAudioNodeProxy } from '../offline-audio-node';

class OfflineAudioDestinationNodeFakerProxy extends OfflineAudioNodeProxy {

    constructor ({ fakeNodeStore }) {
        super({
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fakeNodeStore,
            numberOfInputs: 1,
            numberOfOutputs: 0
        });
    }

    get maxChannelCount () { // eslint-disable-line class-methods-use-this
        // @todo
        return 2;
    }

}

class OfflineAudioDestinationNodeFaker {

    constructor ({ fakeNodeStore }) {
        this._node = null;
        this._proxy = new OfflineAudioDestinationNodeFakerProxy({ fakeNodeStore });
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
        this._node = offlineAudioContext.destination;

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

}

export class OfflineAudioDestinationNodeFakerFactory {

    create ({ fakeNodeStore }) { // eslint-disable-line class-methods-use-this
        return new OfflineAudioDestinationNodeFaker({ fakeNodeStore });
    }

}
