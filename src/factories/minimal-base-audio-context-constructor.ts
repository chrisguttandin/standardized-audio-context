import { EventTarget } from '../event-target';
import { CONTEXT_STORE } from '../globals';
import { IAudioDestinationNode, IMinimalBaseAudioContext } from '../interfaces';
import { TMinimalBaseAudioContextConstructorFactory, TNativeContext, TStateChangeEventHandler } from '../types';

export const createMinimalBaseAudioContextConstructor: TMinimalBaseAudioContextConstructorFactory = (audioDestinationNodeConstructor) => {

    return class MinimalBaseAudioContext extends EventTarget implements IMinimalBaseAudioContext {

        private _destination: IAudioDestinationNode;

        private _nativeContext: TNativeContext;

        constructor (nativeContext: TNativeContext, numberOfChannels: number) {
            super();

            CONTEXT_STORE.set(<any> this, nativeContext);

            // Bug #93: Edge will set the sampleRate of an AudioContext to zero when it is closed.
            const sampleRate = nativeContext.sampleRate;

            Object.defineProperty(nativeContext, 'sampleRate', {
                get: () => sampleRate
            });

            this._nativeContext = nativeContext;
            this._destination = new audioDestinationNodeConstructor(<any> this, numberOfChannels);
        }

        public get currentTime () {
            return this._nativeContext.currentTime;
        }

        public get destination () {
            return this._destination;
        }

        public get onstatechange () {
            return <TStateChangeEventHandler> (<any> this._nativeContext.onstatechange);
        }

        public set onstatechange (value) {
            this._nativeContext.onstatechange = <any> value;
        }

        public get sampleRate () {
            return this._nativeContext.sampleRate;
        }

        public get state () {
            return this._nativeContext.state;
        }

    };

};
