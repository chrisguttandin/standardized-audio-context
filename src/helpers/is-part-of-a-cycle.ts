import { CYCLE_COUNTERS } from '../globals';
import { IAudioNode } from '../interfaces';
import { TContext } from '../types';

export const isPartOfACycle = <T extends TContext>(audioNode: IAudioNode<T>): boolean => {
    return CYCLE_COUNTERS.has(audioNode);
};
