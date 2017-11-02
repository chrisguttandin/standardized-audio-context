import { Injectable, InjectionToken } from '@angular/core';
import { IUnpatchedAudioContextConstructor } from '../interfaces';
import { unpatchedAudioContextConstructor } from '../providers/unpatched-audio-context-constructor';

@Injectable()
export class AudioContextOptionsSupportTester {

    constructor (private _unpatchedAudioContextConstructor: IUnpatchedAudioContextConstructor) { }

    public test () {
        if (this._unpatchedAudioContextConstructor === null) {
            return false;
        }

        let audioContext;

        try {
            audioContext = new (<any> this._unpatchedAudioContextConstructor)({ latencyHint: 'balanced' });
        } catch (err) {
            return false;
        }

        audioContext.close();

        return true;
    }

}

export const AUDIO_CONTEXT_OPTIONS_SUPPORT_TESTER_PROVIDER = {
    deps: [ <InjectionToken<IUnpatchedAudioContextConstructor>> unpatchedAudioContextConstructor ],
    provide: AudioContextOptionsSupportTester
};
