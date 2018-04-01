import { AudioDestinationNode } from '../audio-nodes/audio-destination-node';
import { EventTarget } from '../event-target';
import { CONTEXT_STORE } from '../globals';
import { IAudioDestinationNode, IMinimalBaseAudioContext } from '../interfaces';
import {
    TMinimalBaseAudioContextConstructorFactory,
    TStateChangeEventHandler,
    TUnpatchedAudioContext,
    TUnpatchedOfflineAudioContext
} from '../types';

export const createMinimalBaseAudioContextConstructor: TMinimalBaseAudioContextConstructorFactory = () => {

    return class MinimalBaseAudioContext extends EventTarget implements IMinimalBaseAudioContext {

        private _context: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext;

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

        public get onstatechange () {
            return <TStateChangeEventHandler> (<any> this._context.onstatechange);
        }

        public set onstatechange (value) {
            this._context.onstatechange = <any> value;
        }

        public get sampleRate () {
            return this._context.sampleRate;
        }

        public get state () {
            return this._context.state;
        }

    };

};
