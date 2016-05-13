import { OfflineAudioNodeProxy } from '../offline-audio-node';

class OfflineAudioBufferSourceNodeFakerProxy extends OfflineAudioNodeProxy {

    constructor ({ fakeNodeStore }) {
        super({ fakeNodeStore });

        this._buffer = undefined;
        this._fakeNodeStore = fakeNodeStore;
    }

    get buffer () {
        return this._buffer;
    }

    set buffer (value) {
        // @todo Allow to set the buffer only onces.
        this._buffer = value;
    }

    start (when = 0, offset = 0, duration) {
        var faker = this._fakeNodeStore.get(this);

        faker.start = { duration, offset, when };
    }

}

class OfflineAudioBufferSourceNodeFaker {

    constructor ({ fakeNodeStore }) {
        this._node = null;
        this._proxy = new OfflineAudioBufferSourceNodeFakerProxy({ fakeNodeStore });
        this._sources = new Map();
        this._start = null;

        fakeNodeStore.set(this._proxy, this);
    }

    get proxy () {
        return this._proxy;
    }

    set start (value) {
        this._start = value;
    }

    render (offlineAudioContext) {
        var promises;

        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        promises = [];
        this._node = offlineAudioContext.createBufferSource();

        this._node.buffer = this._proxy.buffer;

        if (this._start !== null) {
            let { duration, offset, when } = this._start;

            if (duration === undefined) {
                this._node.start(when, offset);
            } else {
                this._node.start(when, offset, duration);
            }
        }

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

}

export class OfflineAudioBufferSourceNodeFakerFactory {

    create ({ fakeNodeStore }) {
        return new OfflineAudioBufferSourceNodeFaker({ fakeNodeStore });
    }

}
