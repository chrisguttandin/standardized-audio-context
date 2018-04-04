import { IAudioBuffer, IOfflineAudioContext, IOfflineAudioContextOptions } from '../interfaces';
import { TNativeOfflineAudioContext, TOfflineAudioContextConstructorFactory } from '../types';
import { wrapAudioBufferCopyChannelMethods } from '../wrappers/audio-buffer-copy-channel-methods';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
};

export const createOfflineAudioContextConstructor: TOfflineAudioContextConstructorFactory = (
    baseAudioContextConstructor,
    nativeOfflineAudioContextConstructor,
    startRendering
) => {

    return class OfflineAudioContext extends baseAudioContextConstructor implements IOfflineAudioContext {

        private _length: number;

        private _nativeOfflineAudioContext: TNativeOfflineAudioContext;

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

            super(nativeOfflineAudioContext, numberOfChannels);

            this._length = length;
            this._nativeOfflineAudioContext = nativeOfflineAudioContext;
        }

        public get length () {
            // Bug #17: Safari does not yet expose the length.
            if (this._nativeOfflineAudioContext.length === undefined) {
                return this._length;
            }

            return this._nativeOfflineAudioContext.length;
        }

        public startRendering () {
            return startRendering(this.destination, this._nativeOfflineAudioContext)
                .then((audioBuffer) => {
                    // Bug #5: Safari does not support copyFromChannel() and copyToChannel().
                    if (typeof audioBuffer.copyFromChannel !== 'function') {
                        wrapAudioBufferCopyChannelMethods(audioBuffer);
                    }

                    return <IAudioBuffer> audioBuffer;
                });
        }

    };

};
