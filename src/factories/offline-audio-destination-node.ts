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

    public get maxChannelCount () {
        // @todo
        return 2;
    }

}

export class OfflineAudioDestinationNodeFaker {

    private _node;

    private _proxy;

    private _sources;

    constructor ({ fakeNodeStore }) {
        this._node = null;
        this._proxy = new OfflineAudioDestinationNodeFakerProxy({ fakeNodeStore });
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

        this._node = offlineAudioContext.destination;

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

}

export class OfflineAudioDestinationNodeFakerFactory {

    public create ({ fakeNodeStore }) {
        return new OfflineAudioDestinationNodeFaker({ fakeNodeStore });
    }

}
