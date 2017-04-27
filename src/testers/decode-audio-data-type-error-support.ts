import { Inject, Injectable } from '@angular/core';
import { unpatchedAudioContextConstructor } from '../providers/unpatched-audio-context-constructor';

/**
 * Edge up to version 14, Firefox up to version 52, Safari up to version 9 and maybe other browsers
 * did not refuse to decode invalid parameters with a TypeError.
 */
@Injectable()
export class DecodeAudioDataTypeErrorSupportTester {

    constructor (@Inject(unpatchedAudioContextConstructor) private _UnpatchedAudioContext) { }

    public test (): Promise<boolean> {
        if (this._UnpatchedAudioContext === null) {
            return Promise.resolve(false);
        }

        const audioContext = new this._UnpatchedAudioContext();

        // Bug #21: Safari does not support promises yet.
        // Bug #1: Chrome Canary & Safari requires a successCallback.
        return new Promise((resolve) => {
            audioContext
                .decodeAudioData(null, () => {
                    // Ignore the success callback.
                }, (err) => {
                    audioContext
                        .close()
                        .catch(() => {
                            // Ignore errors.
                        });

                    resolve(err instanceof TypeError);
                })
                .catch(() => {
                    // Ignore errors.
                });
        });
    }

}
