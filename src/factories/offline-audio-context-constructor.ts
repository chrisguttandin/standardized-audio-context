import { cacheTestResult } from '../helpers/cache-test-result';
import { deleteAudioGraph } from '../helpers/delete-audio-graph';
import { IAudioBuffer, IOfflineAudioContext, IOfflineAudioContextOptions } from '../interfaces';
import { testPromiseSupport } from '../support-testers/promise';
import { TAudioContextState, TNativeOfflineAudioContext, TOfflineAudioContextConstructorFactory } from '../types';
import { wrapAudioBufferCopyChannelMethods } from '../wrappers/audio-buffer-copy-channel-methods';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
};

const isSupportingPromises = (nativeOfflineAudioContext: TNativeOfflineAudioContext) => cacheTestResult(
    testPromiseSupport,
    () => testPromiseSupport(nativeOfflineAudioContext)
);

export const createOfflineAudioContextConstructor: TOfflineAudioContextConstructorFactory = (
    baseAudioContextConstructor,
    createInvalidStateError,
    nativeOfflineAudioContextConstructor,
    startRendering
) => {

    return class OfflineAudioContext extends baseAudioContextConstructor implements IOfflineAudioContext {

        private _length: number;

        private _nativeOfflineAudioContext: TNativeOfflineAudioContext;

        private _state: null | TAudioContextState;

        constructor (options: IOfflineAudioContextOptions);
        constructor (numberOfChannels: number, length: number, sampleRate: number);
        constructor (a: number | IOfflineAudioContextOptions, b?: number, c?: number) {
            if (nativeOfflineAudioContextConstructor === null) {
                throw new Error(); // @todo
            }

            let options: IOfflineAudioContextOptions;

            if (typeof a === 'number' && b !== undefined && c !== undefined) {
                options = { length: b, numberOfChannels: a, sampleRate: c };
            } else if (typeof a === 'object') {
                options = a;
            } else {
                throw new Error('The given parameters are not valid.');
            }

            const { length, numberOfChannels, sampleRate } = <typeof DEFAULT_OPTIONS & IOfflineAudioContextOptions> {
                ...DEFAULT_OPTIONS,
                ...options
            };

            const nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor(numberOfChannels, length, sampleRate);

            // #21 Safari does not support promises and therefore would fire the statechange event before the promise can be resolved.
            if (!isSupportingPromises(nativeOfflineAudioContext)) {
                nativeOfflineAudioContext.addEventListener('statechange', (() => {
                    let i = 0;

                    const delayStateChangeEvent = (event: Event) => {
                        if (this._state === 'running') {
                            if (i > 0) {
                                nativeOfflineAudioContext.removeEventListener('statechange', delayStateChangeEvent);
                                event.stopImmediatePropagation();

                                this._waitForThePromiseToSettle(event);
                            } else {
                                i += 1;
                            }
                        }
                    };

                    return delayStateChangeEvent;
                })());
            }

            super(nativeOfflineAudioContext, numberOfChannels);

            this._length = length;
            this._nativeOfflineAudioContext = nativeOfflineAudioContext;
            this._state = null;
        }

        public get length () {
            // Bug #17: Safari does not yet expose the length.
            if (this._nativeOfflineAudioContext.length === undefined) {
                return this._length;
            }

            return this._nativeOfflineAudioContext.length;
        }

        public get state () {
            return (this._state === null) ? this._nativeOfflineAudioContext.state : this._state;
        }

        public startRendering () {
            /*
             * Bug #9 & #59: It is theoretically possible that startRendering() will first render a partialOfflineAudioContext. Therefore
             * the state of the nativeOfflineAudioContext might no transition to running immediately.
             */
            if (this._state === 'running') {
                return Promise.reject(createInvalidStateError());
            }

            this._state = 'running';

            return startRendering(this.destination, this._nativeOfflineAudioContext)
                .then((audioBuffer) => {
                    // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
                    if (typeof audioBuffer.copyFromChannel !== 'function') {
                        wrapAudioBufferCopyChannelMethods(audioBuffer);
                    }

                    this._state = null;

                    deleteAudioGraph(this, this._nativeOfflineAudioContext);

                    return <IAudioBuffer> audioBuffer;
                })
                // @todo This could be written more elegantly when Promise.finally() becomes avalaible.
                .catch((err) => {
                    this._state = null;

                    deleteAudioGraph(this, this._nativeOfflineAudioContext);

                    throw err;
                });
        }

        private _waitForThePromiseToSettle (event: Event) {
            if (this._state === null) {
                this._nativeOfflineAudioContext.dispatchEvent(event);
            } else {
                setTimeout(() => this._waitForThePromiseToSettle(event));
            }
        }

    };

};
