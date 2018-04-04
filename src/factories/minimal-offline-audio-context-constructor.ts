import { IAudioBuffer, IMinimalOfflineAudioContext, IOfflineAudioContextOptions } from '../interfaces';
import { TMinimalOfflineAudioContextConstructorFactory, TNativeOfflineAudioContext } from '../types';
import { wrapAudioBufferCopyChannelMethods } from '../wrappers/audio-buffer-copy-channel-methods';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
};

export const createMinimalOfflineAudioContextConstructor: TMinimalOfflineAudioContextConstructorFactory = (
    minimalBaseAudioContextConstructor,
    nativeOfflineAudioContextConstructor,
    startRendering
) => {

    return class MinimalOfflineAudioContext extends minimalBaseAudioContextConstructor implements IMinimalOfflineAudioContext {

        private _length: number;

        private _nativeOfflineAudioContext: TNativeOfflineAudioContext;

        constructor (options: IOfflineAudioContextOptions) {
            if (nativeOfflineAudioContextConstructor === null) {
                throw new Error(); // @todo
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
