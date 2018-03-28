import { Injectable } from '@angular/core';
import { INativeConstantSourceNode } from '../interfaces';
import { TNativeAudioBufferSourceNode, TNativeOscillatorNode } from '../types';

@Injectable()
export class AudioScheduledSourceNodeStartMethodNegativeParametersWrapper {

    public wrap (audioScheduledSourceNode: TNativeAudioBufferSourceNode | INativeConstantSourceNode | TNativeOscillatorNode) {
        audioScheduledSourceNode.start = ((start) => {
            return (when = 0, offset = 0, duration?: number) => {
                if ((typeof duration === 'number' && duration < 0) || offset < 0 || when < 0) {
                    throw new RangeError("The parameters can't be negative.");
                }

                start.call(audioScheduledSourceNode, when, offset, duration);
            };
        })(audioScheduledSourceNode.start);
    }

}

export const AUDIO_SCHEDULED_SOURCE_NODE_START_METHOD_NEGATIVE_PARAMETERS_WRAPPER_PROVIDER = {
    deps: [ ],
    provide: AudioScheduledSourceNodeStartMethodNegativeParametersWrapper
};
