import { Inject, Injectable } from '@angular/core';
import { unpatchedAudioContextConstructor } from '../providers/unpatched-audio-context-constructor';

@Injectable()
export class ConnectingSupportTester {

    constructor (@Inject(unpatchedAudioContextConstructor) private _UnpatchedAudioContext) { }

    public test (audioContext) {
        if (this._UnpatchedAudioContext === null) {
            return false;
        }

        const analyserNode = audioContext.createAnalyser();
        const anotherAudioContext = new this._UnpatchedAudioContext();

        try {
            analyserNode.connect(anotherAudioContext.destination);
        } catch (err) {
            return err.code === 15;
        } finally {
            anotherAudioContext.close();
        }
    }

}
