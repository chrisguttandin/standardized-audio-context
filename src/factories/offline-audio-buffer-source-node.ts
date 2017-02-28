import { OfflineAudioNodeProxy } from '../offline-audio-node';

class OfflineAudioBufferSourceNodeFakerProxy extends OfflineAudioNodeProxy {

    private _buffer;

    private _ownFakeNodeStore;

    constructor ({ fakeNodeStore }) {
        super({ fakeNodeStore });

        this._buffer = undefined;
        this._ownFakeNodeStore = fakeNodeStore;
    }

    public get buffer () {
        return this._buffer;
    }

    public set buffer (value) {
        // @todo Allow to set the buffer only onces.
        this._buffer = value;
    }

    public start (when = 0, offset = 0, duration) {
        const faker = this._ownFakeNodeStore.get(this);

        faker.start = { duration, offset, when };
    }

}

export class OfflineAudioBufferSourceNodeFaker {

    private _node;

    private _proxy;

    private _sources;

    private _start;

    constructor ({ fakeNodeStore }) {
        this._node = null;
        this._proxy = new OfflineAudioBufferSourceNodeFakerProxy({ fakeNodeStore });
        this._sources = new Map();
        this._start = null;

        fakeNodeStore.set(this._proxy, this);
    }

    public get proxy () {
        return this._proxy;
    }

    public set start (value) {
        this._start = value;
    }

    public render (offlineAudioContext) {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        const promises = [];

        this._node = offlineAudioContext.createBufferSource();

        this._node.buffer = this._proxy.buffer;

        if (this._start !== null) {
            const { duration, offset, when } = this._start;

            if (duration === undefined) {
                this._node.start(when, offset);
            } else {
                this._node.start(when, offset, duration);
            }
        }

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

export class OfflineAudioBufferSourceNodeFakerFactory {

    public create ({ fakeNodeStore }) {
        return new OfflineAudioBufferSourceNodeFaker({ fakeNodeStore });
    }

}
