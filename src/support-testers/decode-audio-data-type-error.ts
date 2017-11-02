import { Injectable, InjectionToken } from '@angular/core';
import { IUnpatchedOfflineAudioContextConstructor } from '../interfaces';
import { unpatchedOfflineAudioContextConstructor } from '../providers/unpatched-offline-audio-context-constructor';

/**
 * Edge up to version 14, Firefox up to version 52, Safari up to version 9 and maybe other browsers
 * did not refuse to decode invalid parameters with a TypeError.
 */
@Injectable()
export class DecodeAudioDataTypeErrorSupportTester {

    constructor (
        private _unpatchedOfflineAudioContextConstructor: IUnpatchedOfflineAudioContextConstructor
    ) { }

    public test (): Promise<boolean> {
        if (this._unpatchedOfflineAudioContextConstructor === null) {
            return Promise.resolve(false);
        }

        const audioContext = new this._unpatchedOfflineAudioContextConstructor(1, 1, 44100);

        // Bug #21: Safari does not support promises yet.
        return new Promise((resolve) => {
            audioContext
                // Bug #1: Safari requires a successCallback.
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

export const DECODE_AUDIO_DATA_TYPE_ERROR_SUPPORT_TESTER_PROVIDER = {
    deps: [ <InjectionToken<IUnpatchedOfflineAudioContextConstructor>> unpatchedOfflineAudioContextConstructor ],
    provide: DecodeAudioDataTypeErrorSupportTester
};
