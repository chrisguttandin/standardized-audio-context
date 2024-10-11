import { deactivateAudioGraph } from '../helpers/deactivate-audio-graph';
import { IAudioBuffer, IOfflineAudioContext, IOfflineAudioContextOptions } from '../interfaces';
import { TAudioContextState, TNativeOfflineAudioContext, TOfflineAudioContextConstructorFactory } from '../types';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
} as const;

export const createOfflineAudioContextConstructor: TOfflineAudioContextConstructorFactory = (
    baseAudioContextConstructor,
    createInvalidStateError,
    createNativeOfflineAudioContext,
    startRendering
) => {
    return class OfflineAudioContext extends baseAudioContextConstructor<IOfflineAudioContext> implements IOfflineAudioContext {
        private _nativeOfflineAudioContext: TNativeOfflineAudioContext;

        private _state: null | TAudioContextState;

        constructor(options: IOfflineAudioContextOptions);
        constructor(numberOfChannels: number, length: number, sampleRate: number);
        constructor(a: number | IOfflineAudioContextOptions, b?: number, c?: number) {
            let options: IOfflineAudioContextOptions;

            if (typeof a === 'number' && b !== undefined && c !== undefined) {
                options = { length: b, numberOfChannels: a, sampleRate: c };
            } else if (typeof a === 'object') {
                options = a;
            } else {
                throw new Error('The given parameters are not valid.');
            }

            const { length, numberOfChannels, sampleRate } = { ...DEFAULT_OPTIONS, ...options };

            const nativeOfflineAudioContext = createNativeOfflineAudioContext(numberOfChannels, length, sampleRate);

            super(nativeOfflineAudioContext, numberOfChannels);

            this._nativeOfflineAudioContext = nativeOfflineAudioContext;
            this._state = null;
        }

        get length(): number {
            return this._nativeOfflineAudioContext.length;
        }

        get state(): TAudioContextState {
            return this._state === null ? this._nativeOfflineAudioContext.state : this._state;
        }

        public startRendering(): Promise<IAudioBuffer> {
            // Bug #87: It is theoretically possible that startRendering() will not be invoked directly.
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
