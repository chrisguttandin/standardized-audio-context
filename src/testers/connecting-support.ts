import { Inject, Injectable } from '@angular/core';
import { IUnpatchedAudioContextConstructor } from '../interfaces';
import { unpatchedAudioContextConstructor } from '../providers/unpatched-audio-context-constructor';
import { TUnpatchedAudioContext } from '../types';

@Injectable()
export class ConnectingSupportTester {

    constructor (
        @Inject(unpatchedAudioContextConstructor) private _unpatchedAudioContextConstructor: IUnpatchedAudioContextConstructor
    ) { }

    public test (audioContext: TUnpatchedAudioContext) {
        if (this._unpatchedAudioContextConstructor === null) {
            return false;
        }

        const analyserNode = audioContext.createAnalyser();
        const anotherAudioContext = new this._unpatchedAudioContextConstructor();

        try {
            analyserNode.connect(anotherAudioContext.destination);
        } catch (err) {
            return err.code === 15;
        } finally {
            anotherAudioContext.close();
        }

        return false;
    }

}
