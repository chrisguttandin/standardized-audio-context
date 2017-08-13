import { AudioDestinationNode } from '../audio-nodes/audio-destination-node';
import { EventTarget } from '../event-target';
import { CONTEXT_STORE } from '../globals';
import { IAudioDestinationNode, IMinimalBaseAudioContext } from '../interfaces';
import { TStateChangeEventHandler, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from '../types';

export class MinimalBaseAudioContext extends EventTarget implements IMinimalBaseAudioContext {

    protected _context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext;

    private _destination: IAudioDestinationNode;

    constructor (context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext, numberOfChannels: number) {
        super();

        CONTEXT_STORE.set(this, context);

        this._context = context;
        this._destination = new AudioDestinationNode(this, numberOfChannels);
    }

    public get currentTime () {
        return this._context.currentTime;
    }

    public get destination () {
        return this._destination;
    }

    public get onstatechange (): null | TStateChangeEventHandler {
        return <TStateChangeEventHandler> this._context.onstatechange;
    }

    public set onstatechange (value: null | TStateChangeEventHandler) {
        this._context.onstatechange = (value === null) ? undefined : <any> value;
    }

    public get sampleRate (): number {
        return this._context.sampleRate;
    }

    public get state () {
        return this._context.state;
    }

}
