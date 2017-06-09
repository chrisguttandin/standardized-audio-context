import { Inject, Injectable } from '@angular/core';
import { IUnpatchedOfflineAudioContextConstructor } from '../interfaces';
import { unpatchedOfflineAudioContextConstructor } from '../providers/unpatched-offline-audio-context-constructor';

/**
 * Edge up to version 14, Firefox up to version 52, Safari up to version 9 and maybe other browsers
 * did not refuse to decode invalid parameters with a TypeError.
 */
@Injectable()
export class DecodeAudioDataTypeErrorSupportTester {

    constructor (
        @Inject(unpatchedOfflineAudioContextConstructor)
        private _unpatchedOfflineAudioContextConstructor: IUnpatchedOfflineAudioContextConstructor
    ) { }

    public test (): Promise<boolean> {
        if (this._unpatchedOfflineAudioContextConstructor === null) {
            return Promise.resolve(false);
        }

        const audioContext = new this._unpatchedOfflineAudioContextConstructor(1, 1, 44100);

        // Bug #21: Safari does not support promises yet.
        // Bug #1: Chrome Canary & Safari requires a successCallback.
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
