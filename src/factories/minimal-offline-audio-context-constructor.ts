import { startRendering } from '../helpers/start-rendering';
import { IAudioBuffer, IMinimalOfflineAudioContext, IOfflineAudioContextOptions } from '../interfaces';
import { TMinimalOfflineAudioContextConstructorFactory, TUnpatchedOfflineAudioContext } from '../types';
import { wrapAudioBufferCopyChannelMethods } from '../wrappers/audio-buffer-copy-channel-methods';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
};

export const createMinimalOfflineAudioContextConstructor: TMinimalOfflineAudioContextConstructorFactory = (
    minimalBaseAudioContextConstructor,
    unpatchedOfflineAudioContextConstructor
) => {

    return class MinimalOfflineAudioContext extends minimalBaseAudioContextConstructor implements IMinimalOfflineAudioContext {

        private _length: number;

        private _unpatchedOfflineAudioContext: TUnpatchedOfflineAudioContext;

        constructor (options: IOfflineAudioContextOptions) {
            if (unpatchedOfflineAudioContextConstructor === null) {
                throw new Error(); // @todo
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
