import { EventTarget } from '../event-target';
import { CONTEXT_STORE } from '../globals';
import { IAudioDestinationNode, IAudioListener, IMinimalBaseAudioContext } from '../interfaces';
import { TAudioContextState, TMinimalBaseAudioContextConstructorFactory, TNativeContext, TStateChangeEventHandler } from '../types';

export const createMinimalBaseAudioContextConstructor: TMinimalBaseAudioContextConstructorFactory = (
    audioDestinationNodeConstructor,
    createAudioListener
) => {

    return class MinimalBaseAudioContext extends EventTarget implements IMinimalBaseAudioContext {

        private _destination: IAudioDestinationNode;

        private _listener: IAudioListener;

        private _nativeContext: TNativeContext;

        constructor (nativeContext: TNativeContext, numberOfChannels: number) {
            super();

            CONTEXT_STORE.set(<any> this, nativeContext);

            // Bug #93: Edge will set the sampleRate of an AudioContext to zero when it is closed.
            const sampleRate = nativeContext.sampleRate;

            Object.defineProperty(nativeContext, 'sampleRate', {
                get: () => sampleRate
            });

            this._destination = new audioDestinationNodeConstructor(<any> this, numberOfChannels);
            this._listener = createAudioListener(<any> this, nativeContext);
            this._nativeContext = nativeContext;
        }

        public get currentTime (): number {
            return this._nativeContext.currentTime;
        }

        public get destination (): IAudioDestinationNode {
            return this._destination;
        }

        get listener (): IAudioListener {
            return this._listener;
        }

        public get onstatechange (): null | TStateChangeEventHandler {
            return <null | TStateChangeEventHandler> this._nativeContext.onstatechange;
        }

        public set onstatechange (value) {
            this._nativeContext.onstatechange = <TNativeContext['onstatechange']> value;
        }

        public get sampleRate (): number {
            return this._nativeContext.sampleRate;
        }

        public get state (): TAudioContextState {
            return this._nativeContext.state;
        }

    };

};
