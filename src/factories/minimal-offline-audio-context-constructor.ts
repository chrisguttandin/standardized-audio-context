import { deactivateAudioGraph } from '../helpers/deactivate-audio-graph';
import { IAudioBuffer, IMinimalOfflineAudioContext, IOfflineAudioContextOptions } from '../interfaces';
import { TAudioContextState, TMinimalOfflineAudioContextConstructorFactory, TNativeOfflineAudioContext } from '../types';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
} as const;

export const createMinimalOfflineAudioContextConstructor: TMinimalOfflineAudioContextConstructorFactory = (
    createInvalidStateError,
    createNativeOfflineAudioContext,
    minimalBaseAudioContextConstructor,
    startRendering
) => {
    return class MinimalOfflineAudioContext
        extends minimalBaseAudioContextConstructor<IMinimalOfflineAudioContext>
        implements IMinimalOfflineAudioContext
    {
        private _length: number;

        private _nativeOfflineAudioContext: TNativeOfflineAudioContext;

        private _state: null | TAudioContextState;

        constructor(options: IOfflineAudioContextOptions) {
            const { length, numberOfChannels, sampleRate } = { ...DEFAULT_OPTIONS, ...options };

            const nativeOfflineAudioContext = createNativeOfflineAudioContext(numberOfChannels, length, sampleRate);

            super(nativeOfflineAudioContext, numberOfChannels);

            this._length = length;
            this._nativeOfflineAudioContext = nativeOfflineAudioContext;
            this._state = null;
        }

        get length(): number {
            // Bug #17: Safari does not yet expose the length.
            if (this._nativeOfflineAudioContext.length === undefined) {
                return this._length;
            }

            return this._nativeOfflineAudioContext.length;
        }

        get state(): TAudioContextState {
            return this._state === null ? this._nativeOfflineAudioContext.state : this._state;
        }

        public startRendering(): Promise<IAudioBuffer> {
            /*
             * Bug #59: It is theoretically possible that startRendering() will first render a partialOfflineAudioContext. Therefore the
             * state of the nativeOfflineAudioContext might no transition to running immediately.
             */
            if (this._state === 'running') {
                return Promise.reject(createInvalidStateError());
            }

            this._state = 'running';

            return startRendering(this.destination, this._nativeOfflineAudioContext).finally(() => {
                this._state = null;

                deactivateAudioGraph(this);
            });
        }
    };
};
