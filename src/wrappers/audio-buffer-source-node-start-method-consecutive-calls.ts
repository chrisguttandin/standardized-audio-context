import { Injectable } from '@angular/core';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { INativeConstantSourceNode } from '../interfaces';
import { TNativeAudioBufferSourceNode, TNativeOscillatorNode } from '../types';

@Injectable()
export class AudioScheduledSourceNodeStartMethodConsecutiveCallsWrapper {

    constructor (private _invalidStateErrorFactory: InvalidStateErrorFactory) { }

    public wrap (audioScheduledSourceNode: TNativeAudioBufferSourceNode | INativeConstantSourceNode | TNativeOscillatorNode) {
        audioScheduledSourceNode.start = ((start) => {
            let isScheduled = false;

            return (when = 0, offset = 0, duration?: number) => {
                if (isScheduled) {
                    throw this._invalidStateErrorFactory.create();
                }

                start.call(audioScheduledSourceNode, when, offset, duration);

                isScheduled = true;
            };
        })(audioScheduledSourceNode.start);
    }

}

export const AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_CONSECUTIVE_CALLS_WRAPPER_PROVIDER = {
    deps: [ InvalidStateErrorFactory ],
    provide: AudioScheduledSourceNodeStartMethodConsecutiveCallsWrapper
};
