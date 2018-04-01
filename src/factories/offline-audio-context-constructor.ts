import { startRendering } from '../helpers/start-rendering';
import { IAudioBuffer, IOfflineAudioContext, IOfflineAudioContextOptions } from '../interfaces';
import { TOfflineAudioContextConstructorFactory, TUnpatchedOfflineAudioContext } from '../types';
import { wrapAudioBufferCopyChannelMethods } from '../wrappers/audio-buffer-copy-channel-methods';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
};

export const createOfflineAudioContextConstructor: TOfflineAudioContextConstructorFactory = (
    baseAudioContextConstructor,
    unpatchedOfflineAudioContextConstructor
) => {

    return class OfflineAudioContext extends baseAudioContextConstructor implements IOfflineAudioContext {

        private _length: number;

        private _unpatchedOfflineAudioContext: TUnpatchedOfflineAudioContext;

        constructor (options: IOfflineAudioContextOptions);
        constructor (numberOfChannels: number, length: number, sampleRate: number);
        constructor (a: number | IOfflineAudioContextOptions, b?: number, c?: number) {
            if (unpatchedOfflineAudioContextConstructor === null) {
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

            const unpatchedOfflineAudioContext = new unpatchedOfflineAudioContextConstructor(numberOfChannels, length, sampleRate);

            super(unpatchedOfflineAudioContext, numberOfChannels);

            this._length = length;
            this._unpatchedOfflineAudioContext = unpatchedOfflineAudioContext;
        }

        public get length () {
            // Bug #17: Safari does not yet expose the length.
            if (this._unpatchedOfflineAudioContext.length === undefined) {
                return this._length;
            }

            return this._unpatchedOfflineAudioContext.length;
        }

        public startRendering () {
            return startRendering(this.destination, this._unpatchedOfflineAudioContext)
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
