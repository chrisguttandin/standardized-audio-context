import { Inject } from '@angular/core';
import { audioContextConstructor } from '../audio-context-constructor';

/**
 * Edge up to version 14, Safari up to version 9 and maybe other browsers did not refuse to decode
 * invalid parameters with a TypeError.
 */
export class DecodeAudioDataTypeErrorSupportTester {

    constructor (audioContextConstructor) {
        this._audioContextConstructor = audioContextConstructor;
    }

    test () {
        const audioContext = new this._audioContextConstructor();

        let promise;

        // bug #21 Safari does not support promises yet.
        try {
            // bug #1: Safari requires a successCallback.
            promise = audioContext
                .decodeAudioData(null, function () {
                    // ignore success callback
                })
                .catch(function (err) {
                    return (err instanceof TypeError);
                });
        } catch (err) {
            return Promise.resolve(err instanceof TypeError);
        }

        if (promise === undefined) {
            return Promise.resolve(false);
        }

        return promise;

    }

}

DecodeAudioDataTypeErrorSupportTester.parameters = [ [ new Inject(audioContextConstructor) ] ];
