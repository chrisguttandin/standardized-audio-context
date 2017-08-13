import { Inject, Injectable } from '@angular/core';
import { IUnpatchedOfflineAudioContextConstructor } from '../interfaces';
import { unpatchedOfflineAudioContextConstructor } from '../providers/unpatched-offline-audio-context-constructor';
import { TUnpatchedAudioContext } from '../types';

@Injectable()
export class ConnectingSupportTester {

    constructor (
        @Inject(unpatchedOfflineAudioContextConstructor)
        private _unpatchedOfflineAudioContextConstructor: IUnpatchedOfflineAudioContextConstructor
    ) { }

    public test (audioContext: TUnpatchedAudioContext) {
        if (this._unpatchedOfflineAudioContextConstructor === null) {
            return false;
        }

        const analyserNode = audioContext.createAnalyser();
        const anotherAudioContext = new this._unpatchedOfflineAudioContextConstructor(1, 1, 44100);

        try {
            analyserNode.connect(anotherAudioContext.destination);
        } catch (err) {
            return err.code === 15;
        }

        return false;
    }

}
