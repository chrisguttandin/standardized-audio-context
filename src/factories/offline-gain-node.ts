import { IAudioNode, IGainNode, IOfflineAudioContext, IOfflineAudioNodeFaker } from '../interfaces';
import { OfflineAudioNodeProxy } from '../offline-audio-node';
import { TUnpatchedOfflineAudioContext } from '../types';

export interface IOfflineGainNodeFakerProxyOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineGainNodeFakerProxy extends OfflineAudioNodeProxy implements IGainNode {

    constructor ({ fakeNodeStore, offlineAudioContext }: IOfflineGainNodeFakerProxyOptions) {
        super({
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fakeNodeStore,
            numberOfInputs: 1,
            numberOfOutputs: 1,
            offlineAudioContext
        });
    }

    public get gain (): AudioParam {
        // @todo Fake a proper AudioParam.
        const audioParam = {
            cancelScheduledValues: (startTime: number) => {
                startTime; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            defaultValue: 1,
            exponentialRampToValueAtTime: (value: number, endTime: number) => {
                endTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            linearRampToValueAtTime: (value: number, endTime: number) => {
                endTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setTargetAtTime: (target: number, startTime: number, timeConstant: number) => {
                startTime; // tslint:disable-line:no-unused-expression
                target; // tslint:disable-line:no-unused-expression
                timeConstant; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setValueAtTime: (value: number, startTime: number) => {
                startTime; // tslint:disable-line:no-unused-expression
                value; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            setValueCurveAtTime: (values: Float32Array, startTime: number, duration: number) => {
                duration; // tslint:disable-line:no-unused-expression
                startTime; // tslint:disable-line:no-unused-expression
                values; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            value: 1
        };

        return audioParam;
    }

}

export interface IOfflineGainNodeFakerOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineGainNodeFaker implements IOfflineAudioNodeFaker {

    private _node: null | GainNode;

    private _proxy: OfflineGainNodeFakerProxy;

    private _sources: Map<IOfflineAudioNodeFaker, { input: number, output: number }>;

    constructor ({ fakeNodeStore, offlineAudioContext }: IOfflineGainNodeFakerOptions) {
        this._node = null;
        this._proxy = new OfflineGainNodeFakerProxy({ fakeNodeStore, offlineAudioContext });
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

        this._node = offlineAudioContext.createGain();

        const promises = Array
            .from(this._sources)
            .map(([ source, { input, output } ]) => {
                // For some reason this currently needs to be a function body with a return statement. The shortcut syntax causes an error.
                return source
                    .render(offlineAudioContext)
                    .then((node) => node.connect(<GainNode> this._node, output, input));
            });

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

export interface IOfflineGainNodeFakerFactoryOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineGainNodeFakerFactory {

    public create ({ fakeNodeStore, offlineAudioContext }: IOfflineGainNodeFakerFactoryOptions) {
        return new OfflineGainNodeFaker({ fakeNodeStore, offlineAudioContext });
    }

}
