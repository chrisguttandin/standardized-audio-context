import { Inject, Injectable } from '@angular/core';
import { IUnpatchedAudioContextConstructor } from '../interfaces';
import { unpatchedAudioContextConstructor } from '../providers/unpatched-audio-context-constructor';

@Injectable()
export class CloseSupportTester {

    constructor (
        @Inject(unpatchedAudioContextConstructor) private _unpatchedAudioContextConstructor: IUnpatchedAudioContextConstructor
    ) { }

    public test () {
        if (this._unpatchedAudioContextConstructor === null) {
            return false;
        }

        // Try to check the prototype before constructing the AudioContext.
        if (this._unpatchedAudioContextConstructor.prototype !== undefined &&
                this._unpatchedAudioContextConstructor.prototype.close !== undefined) {
            return true;
        }

        const audioContext = new this._unpatchedAudioContextConstructor();

        const isAudioContextClosable = (audioContext.close !== undefined);

        try {
            audioContext.close();
        } catch (err) {
            // Ignore errors.
        }

        return isAudioContextClosable;
    }

}
