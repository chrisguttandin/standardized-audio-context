import { EventTarget } from '../event-target';
import { CONTEXT_STORE } from '../globals';
import { wrapEventListener } from '../helpers/wrap-event-listener';
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

        private _onstatechange: null | TStateChangeEventHandler;

        constructor (nativeContext: TNativeContext, numberOfChannels: number) {
            super(nativeContext);

            CONTEXT_STORE.set(<any> this, nativeContext);

            // Bug #93: Edge will set the sampleRate of an AudioContext to zero when it is closed.
            const sampleRate = nativeContext.sampleRate;

            Object.defineProperty(nativeContext, 'sampleRate', {
                get: () => sampleRate
            });

            this._destination = new audioDestinationNodeConstructor(<any> this, numberOfChannels);
            this._listener = createAudioListener(<any> this, nativeContext);
            this._nativeContext = nativeContext;
            this._onstatechange = null;
        }

        get currentTime (): number {
            return this._nativeContext.currentTime;
        }

        get destination (): IAudioDestinationNode {
            return this._destination;
        }

        get listener (): IAudioListener {
            return this._listener;
        }

        get onstatechange (): null | TStateChangeEventHandler {
            return this._onstatechange;
        }

        set onstatechange (value) {
            const wrappedListener = <TNativeContext['onstatechange']> wrapEventListener(this, value);

            this._nativeContext.onstatechange = wrappedListener;

            const nativeOnStateChange = <null | TStateChangeEventHandler> this._nativeContext.onstatechange;

            this._onstatechange = (nativeOnStateChange === wrappedListener) ? value : nativeOnStateChange;
        }

        get sampleRate (): number {
            return this._nativeContext.sampleRate;
        }

        get state (): TAudioContextState {
            return this._nativeContext.state;
        }

    };

};
