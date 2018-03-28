import { Injectable } from '@angular/core';
import { InvalidStateErrorFactory } from '../factories/invalid-state-error';
import { TNativeAudioBufferSourceNode } from '../types';

@Injectable()
export class AudioBufferSourceNodeStartMethodConsecutiveCallsWrapper {

    constructor (private _invalidStateErrorFactory: InvalidStateErrorFactory) { }

    public wrap (audioBufferSourceNode: TNativeAudioBufferSourceNode) {
        audioBufferSourceNode.start = ((start) => {
            let isScheduled = false;

            return (when = 0, offset = 0, duration?: number) => {
                if (isScheduled) {
                    throw this._invalidStateErrorFactory.create();
                }

                start.call(audioBufferSourceNode, when, offset, duration);

                isScheduled = true;
            };
        })(audioBufferSourceNode.start);
    }

}

export const AUDIO_BUFFER_SOURCE_NODE_START_METHOD_CONSECUTIVE_CALLS_WRAPPER_PROVIDER = {
    deps: [ InvalidStateErrorFactory ],
    provide: AudioBufferSourceNodeStartMethodConsecutiveCallsWrapper
};
