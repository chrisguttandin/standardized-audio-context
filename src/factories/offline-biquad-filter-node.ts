import { IAudioNode, IBiquadFilterNode, IOfflineAudioContext, IOfflineAudioNodeFaker } from '../interfaces';
import { OfflineAudioNodeProxy } from '../offline-audio-node';
import { TBiquadFilterType, TUnpatchedOfflineAudioContext } from '../types';

export interface IOfflineBiquadFilterNodeFakerProxyOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    nativeNode: BiquadFilterNode;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineBiquadFilterNodeFakerProxy extends OfflineAudioNodeProxy implements IBiquadFilterNode {

    private _nativeNode: BiquadFilterNode;

    private _type: TBiquadFilterType;

    constructor ({ fakeNodeStore, nativeNode, offlineAudioContext }: IOfflineBiquadFilterNodeFakerProxyOptions) {
        super({
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fakeNodeStore,
            numberOfInputs: 1,
            numberOfOutputs: 1,
            offlineAudioContext
        });

        this._nativeNode = nativeNode;
        this._type = <TBiquadFilterType> nativeNode.type;
    }

    public get detune () {
        // @todo Fake a proper AudioParam.
        const audioParam = {
            cancelScheduledValues: (startTime: number) => {
                startTime; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            defaultValue: 0,
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
            value: 0
        };

        return audioParam;
    }

    public get frequency () {
        // @todo Fake a proper AudioParam.
        const audioParam = {
            cancelScheduledValues: (startTime: number) => {
                startTime; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            defaultValue: 350,
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
            value: 350
        };

        return audioParam;
    }

    public get gain () {
        // @todo Fake a proper AudioParam.
        const audioParam = {
            cancelScheduledValues: (startTime: number) => {
                startTime; // tslint:disable-line:no-unused-expression

                return audioParam;
            },
            defaultValue: 0,
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
            value: 0
        };

        return audioParam;
    }

    public get Q () {
        // @todo Fake a proper AudioParam.
        const audioParam =  {
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

    public get type () {
        return this._type;
    }

    public set type (value) {
        this._type = value;
    }

    public getFrequencyResponse (frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array) {
        return this._nativeNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
    }

}

export interface IOfflineBiquadFilterNodeFakerOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    nativeNode: BiquadFilterNode;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineBiquadFilterNodeFaker implements IOfflineAudioNodeFaker {

    private _node: null | BiquadFilterNode;

    private _proxy: OfflineBiquadFilterNodeFakerProxy;

    private _sources: Map<IOfflineAudioNodeFaker, { input: number, output: number }>;

    constructor ({ fakeNodeStore, nativeNode, offlineAudioContext }: IOfflineBiquadFilterNodeFakerOptions) {
        this._node = null;
        this._proxy = new OfflineBiquadFilterNodeFakerProxy({ fakeNodeStore, nativeNode, offlineAudioContext });
        this._sources = new Map();

        fakeNodeStore.set(this._proxy, this);
    }

    get proxy () {
        return this._proxy;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext) {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

        const promises = [];

        this._node = offlineAudioContext.createBiquadFilter();

        this._node.type = this._proxy.type;

        for (const [ source, { input, output } ] of this._sources) {
            promises.push(source
                .render(offlineAudioContext)
                .then((node) => node.connect(<BiquadFilterNode> this._node, output, input)));
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

export interface IOfflineBiquadFilterNodeFakerFactoryOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    nativeNode: BiquadFilterNode;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineBiquadFilterNodeFakerFactory {

    public create ({ fakeNodeStore, nativeNode, offlineAudioContext }: IOfflineBiquadFilterNodeFakerFactoryOptions) {
        return new OfflineBiquadFilterNodeFaker({
            fakeNodeStore,
            nativeNode, offlineAudioContext
        });
    }

}
