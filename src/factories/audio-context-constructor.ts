import { deactivateAudioGraph } from '../helpers/deactivate-audio-graph';
import { isValidLatencyHint } from '../helpers/is-valid-latency-hint';
import {
    IAudioContext,
    IAudioContextOptions,
    IMediaElementAudioSourceNode,
    IMediaStreamAudioDestinationNode,
    IMediaStreamAudioSourceNode,
    IMediaStreamTrackAudioSourceNode
} from '../interfaces';
import { TAudioContextConstructorFactory, TAudioContextState, TNativeAudioContext } from '../types';

export const createAudioContextConstructor: TAudioContextConstructorFactory = (
    baseAudioContextConstructor,
    createInvalidStateError,
    mediaElementAudioSourceNodeConstructor,
    mediaStreamAudioDestinationNodeConstructor,
    mediaStreamAudioSourceNodeConstructor,
    mediaStreamTrackAudioSourceNodeConstructor,
    nativeAudioContextConstructor
) => {
    return class AudioContext extends baseAudioContextConstructor<IAudioContext> implements IAudioContext {
        private _nativeAudioContext: TNativeAudioContext;

        private _state: null | 'suspended';

        constructor(options: IAudioContextOptions = {}) {
            if (nativeAudioContextConstructor === null) {
                throw new Error('Missing the native AudioContext constructor.');
            }

            const nativeAudioContext = new nativeAudioContextConstructor(options);

            // Bug #51: Firefox doesn't throw an error if the given latencyHint is invalid.
            if (!isValidLatencyHint(options.latencyHint)) {
                throw new TypeError(
                    `The provided value '${options.latencyHint}' is not a valid enum value of type AudioContextLatencyCategory.`
                );
            }

            super(nativeAudioContext, 2);

            this._nativeAudioContext = nativeAudioContext;
            this._state = null;

            /*
             * Bug #34: Chrome pretends to be running right away, but dispatches an onstatechange event when the state actually changes to
             * 'running'.
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

        get baseLatency(): number {
            return this._nativeAudioContext.baseLatency;
        }

        get state(): TAudioContextState {
            return this._state !== null ? this._state : this._nativeAudioContext.state;
        }

        public close(): Promise<void> {
            // Bug #35: Safari throws an error if the AudioContext was closed before.
            if (this.state === 'closed') {
                return this._nativeAudioContext.close().then(() => {
                    throw createInvalidStateError();
                });
            }

            // Bug #34: If the state was set to suspended before it should be revoked now.
            if (this._state === 'suspended') {
                this._state = null;
            }

            return this._nativeAudioContext.close().then(() => deactivateAudioGraph(this));
        }

        public createMediaElementSource(mediaElement: HTMLMediaElement): IMediaElementAudioSourceNode<this> {
            return new mediaElementAudioSourceNodeConstructor(this, { mediaElement });
        }

        public createMediaStreamDestination(): IMediaStreamAudioDestinationNode<this> {
            return new mediaStreamAudioDestinationNodeConstructor(this);
        }

        public createMediaStreamSource(mediaStream: MediaStream): IMediaStreamAudioSourceNode<this> {
            return new mediaStreamAudioSourceNodeConstructor(this, { mediaStream });
        }

        public createMediaStreamTrackSource(mediaStreamTrack: MediaStreamTrack): IMediaStreamTrackAudioSourceNode<this> {
            return new mediaStreamTrackAudioSourceNodeConstructor(this, { mediaStreamTrack });
        }

        public resume(): Promise<void> {
            if (this._state === 'suspended') {
                return new Promise((resolve, reject) => {
                    const resolvePromise = () => {
                        this._nativeAudioContext.removeEventListener('statechange', resolvePromise);

                        if (this._nativeAudioContext.state === 'running') {
                            resolve();
                        } else {
                            this.resume().then(resolve, reject);
                        }
                    };

                    this._nativeAudioContext.addEventListener('statechange', resolvePromise);
                });
            }

            return this._nativeAudioContext.resume();
        }

        public suspend(): Promise<void> {
            return this._nativeAudioContext.suspend();
        }
    };
};
