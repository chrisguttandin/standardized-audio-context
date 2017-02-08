import { Inject, Injectable } from '@angular/core';
import { unpatchedAudioContextConstructor } from '../providers/unpatched-audio-context-constructor';

@Injectable()
export class CloseSupportTester {

    constructor (@Inject(unpatchedAudioContextConstructor) private _UnpatchedAudioContext) { }

    public test () {
        if (this._UnpatchedAudioContext === null) {
            return false;
        }

        const audioContext = new this._UnpatchedAudioContext();

        const isAudioContextClosable = (audioContext.close !== undefined);

        try {
            audioContext.close();
        } catch (err) {
            // Ignore errors.
        }

        return isAudioContextClosable;
    }

}
