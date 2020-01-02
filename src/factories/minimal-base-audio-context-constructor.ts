import { CONTEXT_STORE } from '../globals';
import { IAudioDestinationNode, IAudioListener, IMinimalBaseAudioContext, IStateChangeEventHandler } from '../interfaces';
import { TAudioContextState, TMinimalBaseAudioContextConstructorFactory, TNativeContext } from '../types';

export const createMinimalBaseAudioContextConstructor: TMinimalBaseAudioContextConstructorFactory = (
    audioDestinationNodeConstructor,
    createAudioListener,
    eventTargetConstructor,
    wrapEventListener
) => {

    return class MinimalBaseAudioContext extends eventTargetConstructor implements IMinimalBaseAudioContext {

        private _destination: IAudioDestinationNode<this>;

        private _listener: IAudioListener;

        private _onstatechange: null | IStateChangeEventHandler<this>;

        constructor (private _nativeContext: TNativeContext, numberOfChannels: number) {
            super(_nativeContext);

            CONTEXT_STORE.set(this, _nativeContext);

            // Bug #93: Edge will set the sampleRate of an AudioContext to zero when it is closed.
            const sampleRate = _nativeContext.sampleRate;

            Object.defineProperty(_nativeContext, 'sampleRate', {
                get: () => sampleRate
            });

            this._destination = new audioDestinationNodeConstructor(this, numberOfChannels);
            this._listener = createAudioListener(this, _nativeContext);
            this._onstatechange = null;
        }

        get currentTime (): number {
            return this._nativeContext.currentTime;
        }

        get destination (): IAudioDestinationNode<this> {
            return this._destination;
        }

        get listener (): IAudioListener {
            return this._listener;
        }

        get onstatechange (): null | IStateChangeEventHandler<this> {
            return this._onstatechange;
        }

        set onstatechange (value) {
            const wrappedListener = (typeof value === 'function') ? wrapEventListener(this, value) : null;

            this._nativeContext.onstatechange = wrappedListener;

            const nativeOnStateChange = this._nativeContext.onstatechange;

            this._onstatechange = (nativeOnStateChange !== null && nativeOnStateChange === wrappedListener) ? value : nativeOnStateChange;
        }

        get sampleRate (): number {
            return this._nativeContext.sampleRate;
        }

        get state (): TAudioContextState {
            return this._nativeContext.state;
        }

    };

};
