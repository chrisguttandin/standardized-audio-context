import 'core-js/es7/reflect'; // tslint:disable-line:ordered-imports
import { ReflectiveInjector } from '@angular/core';
import { IndexSizeErrorFactory } from '../factories/index-size-error';
import { startRendering } from '../helpers/start-rendering';
import { IOfflineAudioContext, IOfflineAudioContextOptions } from '../interfaces';
import {
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    unpatchedOfflineAudioContextConstructor as nptchdFflnDCntxtCnstrctr
} from '../providers/unpatched-offline-audio-context-constructor';
import { WINDOW_PROVIDER } from '../providers/window';
import { TUnpatchedOfflineAudioContext } from '../types';
import { AudioBufferWrapper } from '../wrappers/audio-buffer';
import { BaseAudioContext } from './base-audio-context';

const injector = ReflectiveInjector.resolveAndCreate([
    AudioBufferWrapper,
    IndexSizeErrorFactory,
    UNPATCHED_OFFLINE_AUDIO_CONTEXT_CONSTRUCTOR_PROVIDER,
    WINDOW_PROVIDER
]);

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
        if (typeof a === 'number' && b !== undefined && c !== undefined) {
            a = { length: b, numberOfChannels: a, sampleRate: c };
        } else if (typeof a !== 'object') {
            throw new Error('The given parameters are not valid.');
        }

        const { length, numberOfChannels, sampleRate } = <typeof DEFAULT_OPTIONS & IOfflineAudioContextOptions> {
            ...DEFAULT_OPTIONS,
            ...a
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

                return audioBuffer;
            });
    }

}
