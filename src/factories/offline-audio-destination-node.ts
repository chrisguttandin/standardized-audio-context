import { IAudioDestinationNode, IAudioNode, IOfflineAudioContext, IOfflineAudioNodeFaker } from '../interfaces';
import { OfflineAudioNodeProxy } from '../offline-audio-node';
import { TUnpatchedOfflineAudioContext } from '../types';

export interface IOfflineAudioDestinationNodeFakerProxyOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineAudioDestinationNodeFakerProxy extends OfflineAudioNodeProxy implements IAudioDestinationNode {

    constructor ({ fakeNodeStore, offlineAudioContext }: IOfflineAudioDestinationNodeFakerProxyOptions) {
        super({
            channelCount: 2,
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fakeNodeStore,
            numberOfInputs: 1,
            numberOfOutputs: 0,
            offlineAudioContext
        });
    }

    public get maxChannelCount () {
        // @todo
        return 2;
    }

}

export interface IOfflineAudioDestinationNodeFakerOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineAudioDestinationNodeFaker implements IOfflineAudioNodeFaker {

    private _node: null | AudioDestinationNode;

    private _proxy: OfflineAudioDestinationNodeFakerProxy;

    private _sources: Map<IOfflineAudioNodeFaker, { input: number, output: number }>;

    constructor ({ fakeNodeStore, offlineAudioContext }: IOfflineAudioDestinationNodeFakerOptions) {
        this._node = null;
        this._proxy = new OfflineAudioDestinationNodeFakerProxy({ fakeNodeStore, offlineAudioContext });
        this._sources = new Map();

        fakeNodeStore.set(this._proxy, this);
    }

    public get proxy () {
        return this._proxy;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext) {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        const promises = [];

        this._node = offlineAudioContext.destination;

        for (const [ source, { input, output } ] of this._sources) {
            promises.push(source
                .render(offlineAudioContext)
                .then((node) => node.connect(<AudioDestinationNode> this._node, output, input)));
        }

        return Promise
            .all(promises)
            .then(() => this._node);
    }

    public wire (source: IOfflineAudioNodeFaker, output: number, input: number) {
        this._sources.set(source, { input, output });

        return this._proxy;
    }

    public unwire (source: IOfflineAudioNodeFaker) {
        this._sources.delete(source);
    }

}

export interface IOfflineAudioDestinationNodeFakerFactoryOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineAudioDestinationNodeFakerFactory {

    public create ({ fakeNodeStore, offlineAudioContext }: IOfflineAudioDestinationNodeFakerFactoryOptions) {
        return new OfflineAudioDestinationNodeFaker({ fakeNodeStore, offlineAudioContext });
    }

}
