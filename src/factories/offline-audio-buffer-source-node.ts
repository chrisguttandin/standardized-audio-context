import { IAudioBufferSourceNode, IAudioNode, IOfflineAudioContext, IOfflineAudioNodeFaker } from '../interfaces';
import { OfflineAudioNodeProxy } from '../offline-audio-node';
import { TUnpatchedOfflineAudioContext } from '../types';

export interface IOfflineAudioBufferSourceNodeFakerProxyOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineAudioBufferSourceNodeFakerProxy extends OfflineAudioNodeProxy implements IAudioBufferSourceNode {

    private _buffer: null | AudioBuffer;

    private _ownFakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    constructor ({ fakeNodeStore, offlineAudioContext }: IOfflineAudioBufferSourceNodeFakerProxyOptions) {
        super({
            channelCountMode: 'max',
            channelInterpretation: 'speakers',
            fakeNodeStore,
            numberOfInputs: 0,
            numberOfOutputs: 1,
            offlineAudioContext
        });

        this._buffer = null;
        this._ownFakeNodeStore = fakeNodeStore;
    }

    public get buffer () {
        return this._buffer;
    }

    public set buffer (value) {
        // @todo Allow to set the buffer only onces.
        this._buffer = value;
    }

    public get detune (): AudioParam {
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

    public get loop () {
        // @todo
        return false;
    }

    public get loopEnd () {
        // @todo
        return 0;
    }

    public get loopStart () {
        // @todo
        return 0;
    }

    public get playbackRate (): AudioParam {
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

    public start (when = 0, offset = 0, duration?: number) {
        const faker = <OfflineAudioBufferSourceNodeFaker> this._ownFakeNodeStore.get(this);

        faker.start = { duration, offset, when };
    }

    public stop (when = 0) {
        // @todo

        when; // tslint:disable-line:no-unused-expression
    }

}

export interface IOfflineAudioBufferSourceNodeFakerOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineAudioBufferSourceNodeFaker implements IOfflineAudioNodeFaker {

    private _node: null | AudioBufferSourceNode;

    private _proxy: OfflineAudioBufferSourceNodeFakerProxy;

    private _sources: Map<IOfflineAudioNodeFaker, { input: number, output: number }>;

    private _start: null | { duration?: number, offset: number, when: number };

    constructor ({ fakeNodeStore, offlineAudioContext }: IOfflineAudioBufferSourceNodeFakerOptions) {
        this._node = null;
        this._proxy = new OfflineAudioBufferSourceNodeFakerProxy({ fakeNodeStore, offlineAudioContext });
        this._sources = new Map();
        this._start = null;

        fakeNodeStore.set(this._proxy, this);
    }

    public get proxy () {
        return this._proxy;
    }

    public set start (value: { duration?: number, offset: number, when: number }) {
        this._start = value;
    }

    public render (offlineAudioContext: TUnpatchedOfflineAudioContext) {
        if (this._node !== null) {
            return Promise.resolve(this._node);
        }

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

        const promises = Array
            .from(this._sources)
            .map(([ source, { input, output } ]) => {
                // For some reason this currently needs to be a function body with a return statement. The shortcut syntax causes an error.
                return source
                    .render(offlineAudioContext)
                    .then((node) => node.connect(<AudioBufferSourceNode> this._node, output, input));
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

export interface IOfflineAudioBufferSourceNodeFakerFactoryOptions {

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineAudioBufferSourceNodeFakerFactory {

    public create ({ fakeNodeStore, offlineAudioContext }: IOfflineAudioBufferSourceNodeFakerFactoryOptions) {
        return new OfflineAudioBufferSourceNodeFaker({ fakeNodeStore, offlineAudioContext });
    }

}
