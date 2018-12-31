import { isValidLatencyHint } from '../helpers/is-valid-latency-hint';
import { IAudioContext, IAudioContextOptions, IMediaElementAudioSourceNode, IMediaStreamAudioSourceNode } from '../interfaces';
import { TAudioContextConstructorFactory, TAudioContextState, TNativeAudioContext } from '../types';

export const createAudioContextConstructor: TAudioContextConstructorFactory = (
    baseAudioContextConstructor,
    createInvalidStateError,
    mediaElementAudioSourceNodeConstructor,
    mediaStreamAudioSourceNodeConstructor,
    nativeAudioContextConstructor
) => {

    return class AudioContext extends baseAudioContextConstructor implements IAudioContext {

        private _baseLatency: number;

        private _nativeAudioContext: TNativeAudioContext;

        private _state: null | 'suspended';

        constructor (options: IAudioContextOptions = { }) {
            if (nativeAudioContextConstructor === null) {
                throw new Error(); // @todo
            }

            const nativeAudioContext = new nativeAudioContextConstructor(options);

            // Bug #51 Only Chrome and Opera throw an error if the given latencyHint is invalid.
            if (!isValidLatencyHint(options.latencyHint)) {
                throw new TypeError(
                    `The provided value '${ options.latencyHint }' is not a valid enum value of type AudioContextLatencyCategory.`
                );
            }

            super(nativeAudioContext, nativeAudioContext.destination.channelCount);

            const { latencyHint } = options;
            const { sampleRate } = nativeAudioContext;

            // @todo The values for 'balanced', 'interactive' and 'playback' are just copied from Chrome's implementation.
            this._baseLatency = (typeof nativeAudioContext.baseLatency === 'number')
                ? nativeAudioContext.baseLatency
                : (latencyHint === 'balanced')
                    ? (512 / sampleRate)
                    : (latencyHint === 'interactive' || latencyHint === undefined)
                        ? (256 / sampleRate)
                        : (latencyHint === 'playback')
                            ? (1024 / sampleRate)
                            /*
                             * @todo The min (256) and max (16384) values are taken from the allowed bufferSize values of a
                             * ScriptProcessorNode.
                             */
                            : (Math.max(2, Math.min(128, Math.round((latencyHint * sampleRate) / 128))) / sampleRate);
            this._nativeAudioContext = nativeAudioContext;
            this._state = null;

            /*
             * Bug #34: Chrome and Opera pretend to be running right away, but fire an onstatechange event when the state actually changes
             * to 'running'.
             */
            if (nativeAudioContext.state === 'running') {
                this._state = 'suspended';

                const revokeState = () => {
                    if (this._state === 'suspended') {
                        this._state = null;
                    }

                    nativeAudioContext.removeEventListener('statechange', revokeState);
                };

                nativeAudioContext.addEventListener('statechange', revokeState);
            }
        }

        public get baseLatency (): number {
            return this._baseLatency;
        }

        public get state (): TAudioContextState {
            return (this._state !== null) ? this._state : this._nativeAudioContext.state;
        }

        public close (): Promise<void> {
            // Bug #35: Firefox does not throw an error if the AudioContext was closed before.
            if (this.state === 'closed') {
                return this._nativeAudioContext
                    .close()
                    .then(() => {
                        throw createInvalidStateError();
                    });
            }

            // Bug #34: If the state was set to suspended before it should be revoked now.
            if (this._state === 'suspended') {
                this._state = null;
            }

            return this._nativeAudioContext.close();

            /*
             * Bug #50: Deleting the AudioGraph is currently not possible anymore.
             * ...then(() => deleteAudioGraph(this, this._nativeAudioContext));
             */
        }

        public createMediaElementSource (mediaElement: HTMLMediaElement): IMediaElementAudioSourceNode {
            return new mediaElementAudioSourceNodeConstructor(this, { mediaElement });
        }

        public createMediaStreamSource (mediaStream: MediaStream): IMediaStreamAudioSourceNode {
            return new mediaStreamAudioSourceNodeConstructor(this, { mediaStream });
        }

        public resume (): Promise<void> {
            return this._nativeAudioContext
                .resume()
                .catch((err) => {
                    // Bug #55: Chrome, Edge and Opera do throw an InvalidAccessError instead of an InvalidStateError.
                    // Bug #56: Safari invokes the catch handler but without an error.
                    if (err === undefined || err.code === 15) {
                        throw createInvalidStateError();
                    }

                    throw err; // tslint:disable-line:rxjs-throw-error
                });
        }

        public suspend (): Promise<void> {
            return this._nativeAudioContext
                .suspend()
                .catch((err) => {
                    // Bug #56: Safari invokes the catch handler but without an error.
                    if (err === undefined) {
                        throw createInvalidStateError();
                    }

                    throw err; // tslint:disable-line:rxjs-throw-error
                });
        }

    };

};
