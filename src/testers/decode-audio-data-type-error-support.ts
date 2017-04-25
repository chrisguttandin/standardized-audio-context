import { Inject, Injectable } from '@angular/core';
import { unpatchedAudioContextConstructor } from '../providers/unpatched-audio-context-constructor';

/**
 * Edge up to version 14, Safari up to version 9 and maybe other browsers did not refuse to decode
 * invalid parameters with a TypeError.
 */
@Injectable()
export class DecodeAudioDataTypeErrorSupportTester {

    constructor (@Inject(unpatchedAudioContextConstructor) private _UnpatchedAudioContext) { }

    public test () {
        if (this._UnpatchedAudioContext === null) {
            return Promise.resolve(false);
        }

        const audioContext = new this._UnpatchedAudioContext();

        let promise;

        // Bug #21 Safari does not support promises yet.
        try {
            // Bug #1: Chrome Canary & Safari requires a successCallback.
            promise = audioContext
                .decodeAudioData(null, () => {
                    // Ignore the success callback.
                })
                .catch ((err) => (err instanceof TypeError));
        } catch (err) {
            return Promise.resolve(err instanceof TypeError);
        } finally {
            try {
                audioContext.close();
            } catch (err) {
                // Ignore errors.
            }
        }

        if (promise === undefined) {
            return Promise.resolve(false);
        }

        return promise;
    }

}
