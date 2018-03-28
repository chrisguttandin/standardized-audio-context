import { Injectable } from '@angular/core';
import { INativeConstantSourceNode } from '../interfaces';
import { TNativeAudioBufferSourceNode, TNativeOscillatorNode } from '../types';

@Injectable()
export class AudioScheduledSourceNodeStopMethodNegativeParametersWrapper {

    public wrap (audioScheduledSourceNode: TNativeAudioBufferSourceNode | INativeConstantSourceNode | TNativeOscillatorNode) {
        audioScheduledSourceNode.stop = ((stop) => {
            return (when = 0) => {
                if (when < 0) {
                    throw new RangeError("The parameter can't be negative.");
                }

                stop.call(audioScheduledSourceNode, when);
            };
        })(audioScheduledSourceNode.stop);
    }

}

export const AUDIO_SCHEDULED_SOURCE_NODE_STOP_METHOD_NEGATIVE_PARAMETERS_WRAPPER_PROVIDER = {
    deps: [ ],
    provide: AudioScheduledSourceNodeStopMethodNegativeParametersWrapper
};
