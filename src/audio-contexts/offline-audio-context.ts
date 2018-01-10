import { Injector } from '@angular/core';
import { INDEX_SIZE_ERROR_FACTORY_PROVIDER } from '../factories/index-size-error';
import { startRendering } from '../helpers/start-rendering';
import { IAudioBuffer, IOfflineAudioContext, IOfflineAudioContextOptions } from '../interfaces';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr
} from '../providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import { TUnpatchedOfflineAudioContext } from '../types';
import { AUDIO_BUFFER_WRAPPER_PROVIDER, AudioBufferWrapper } from '../wrappers/audio-buffer';
import { BaseAudioContext } from './base-audio-context';

const injector = Injector.create({
    providers: [
        AUDIO_BUFFER_WRAPPER_PROVIDER,
        INDEX_SIZE_ERROR_FACTORY_PROVIDER,
        UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
        WINDOW_PROVIDER
    ]
});

const audioBufferWrapper = injector.get(AudioBufferWrapper);
const unpatchedOfflineAudioContextConstructor = injector.get(nptchdFflnDCntxtCnstrctr);

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
};

export class OfflineAudioContext extends BaseAudioContext implements IOfflineAudioContext {

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

    public get length (): number {
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
                    audioBufferWrapper.wrap(audioBuffer);
                }

                return <IAudioBuffer> audioBuffer;
            });
    }

}
