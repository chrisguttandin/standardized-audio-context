import { IOfflineAudioContext, IOfflineAudioNodeFaker, IAudioNode } from './interfaces';
import { TChannelCountMode, TChannelInterpretation } from './types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare var DOMException: {
    new (message: string, name: string): DOMException;
};

export interface IAudioNodeOptions {

    channelCount?: number;

    channelCountMode: TChannelCountMode;

    channelInterpretation: TChannelInterpretation;

    fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    numberOfInputs: number;

    numberOfOutputs: number;

    offlineAudioContext: IOfflineAudioContext;

}

export class OfflineAudioNodeProxy implements IAudioNode {

    private _channelCount: number;

    private _channelCountMode: TChannelCountMode;

    private _channelInterpretation: TChannelInterpretation;

    private _fakeNodeStore: WeakMap<IAudioNode, IOfflineAudioNodeFaker>;

    private _numberOfInputs: number;

    private _numberOfOutputs: number;

    private _offlineAudioContext: IOfflineAudioContext;

    constructor ({
        channelCount = 2,
        channelCountMode,
        channelInterpretation,
        fakeNodeStore,
        numberOfInputs,
        numberOfOutputs,
        offlineAudioContext
    }: IAudioNodeOptions) {
        this._channelCount = channelCount;
        this._channelCountMode = channelCountMode;
        this._channelInterpretation = channelInterpretation;
        this._fakeNodeStore = fakeNodeStore;
        this._numberOfInputs = numberOfInputs;
        this._numberOfOutputs = numberOfOutputs;
        this._offlineAudioContext = offlineAudioContext;
    }

    public get channelCount () {
        return this._channelCount;
    }

    public set channelCount (value) {
        this._channelCount = value;
    }

    public get channelCountMode () {
        return this._channelCountMode;
    }

    public set channelCountMode (value) {
        this._channelCountMode = value;
    }

    public get channelInterpretation () {
        return this._channelInterpretation;
    }

    public set channelInterpretation (value) {
        this._channelInterpretation = value;
    }

    public get context () {
        return this._offlineAudioContext;
    }

    public get numberOfInputs () {
        return this._numberOfInputs;
    }

    public set numberOfInputs (value) {
        this._numberOfInputs = value;
    }

    public get numberOfOutputs () {
        return this._numberOfOutputs;
    }

    public set numberOfOutputs (value) {
        this._numberOfOutputs = value;
    }

    addEventListener (type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        // @todo
        type;
        listener;
        options;
    }

    public connect (destination: IAudioNode, output = 0, input = 0): IAudioNode {
        const faker = this._fakeNodeStore.get(destination);

        if (faker === undefined) {
            let exception;

            // @todo Use the error factory.
            try {
                exception = new DOMException('', 'InvalidAccessError');
            } catch (err) {
                exception = new Error();

                (<any> exception).code = 15;
                exception.name = 'InvalidAccessError';
            }

            throw exception;
        }

        const source = this._fakeNodeStore.get(this);

        if (source === undefined) {
            throw new Error(/* @todo */);
        }

        return faker.wire(source, output, input);
    }

    public disconnect (destination: IAudioNode) {
        const faker = this._fakeNodeStore.get(destination);

        if (faker === undefined) {
            throw new Error(/* @todo */);
        }

        const source = this._fakeNodeStore.get(this);

        if (source === undefined) {
            throw new Error(/* @todo */);
        }

        return faker.unwire(source);
    }

    dispatchEvent (evt: Event) {
        // @todo
        evt;

        return false;
    }

    removeEventListener (type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
        // @todo
        type;
        listener;
        options;
    }

}
