import { CYCLE_COUNTERS } from '../globals';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';

export const isPartOfACycle = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): boolean => {
    return CYCLE_COUNTERS.has(audioNode);
};
