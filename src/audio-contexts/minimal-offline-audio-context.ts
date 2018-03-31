import { Injector } from '@angular/core';
import { startRendering } from '../helpers/start-rendering';
import { IAudioBuffer, IMinimalOfflineAudioContext, IOfflineAudioContextOptions } from '../interfaces';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr
} from '../providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import { TUnpatchedOfflineAudioContext } from '../types';
import { wrapAudioBuffer } from '../wrappers/audio-buffer';
import { MinimalBaseAudioContext } from './minimal-base-audio-context';

const DEFAULT_OPTIONS = {
    numberOfChannels: 1
};

const injector = Injector.create({
    providers: [
        UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
        WINDOW_PROVIDER
    ]
});

const unpatchedOfflineAudioContextConstructor = injector.get(nptchdFflnDCntxtCnstrctr);

export class MinimalOfflineAudioContext extends MinimalBaseAudioContext implements IMinimalOfflineAudioContext {

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
                    wrapAudioBuffer(audioBuffer);
                }

                return <IAudioBuffer> audioBuffer;
            });
    }

}
