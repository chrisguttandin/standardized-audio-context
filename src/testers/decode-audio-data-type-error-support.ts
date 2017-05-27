import { Inject, Injectable } from '@angular/core';
import { IUnpatchedAudioContextConstructor } from '../interfaces';
import { unpatchedAudioContextConstructor } from '../providers/unpatched-audio-context-constructor';

/**
 * Edge up to version 14, Firefox up to version 52, Safari up to version 9 and maybe other browsers
 * did not refuse to decode invalid parameters with a TypeError.
 */
@Injectable()
export class DecodeAudioDataTypeErrorSupportTester {

    constructor (
        @Inject(unpatchedAudioContextConstructor) private _unpatchedAudioContextConstructor: IUnpatchedAudioContextConstructor
    ) { }

    public test (): Promise<boolean> {
        if (this._unpatchedAudioContextConstructor === null) {
            return Promise.resolve(false);
        }

        const audioContext = new this._unpatchedAudioContextConstructor();

        // Bug #21: Safari does not support promises yet.
        // Bug #1: Safari requires a successCallback.
        return new Promise((resolve) => {
            audioContext
                .decodeAudioData(<any> null, () => {
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
