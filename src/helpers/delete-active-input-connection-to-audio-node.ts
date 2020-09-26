import { IAudioNode } from '../interfaces';
import { TActiveInputConnection, TContext } from '../types';
import { pickElementFromSet } from './pick-element-from-set';

export const deleteActiveInputConnectionToAudioNode = <T extends TContext>(
    activeInputs: Set<TActiveInputConnection<T>>[],
    source: IAudioNode<T>,
    output: number,
    input: number
) => {
    return pickElementFromSet(
        activeInputs[input],
        (activeInputConnection) => activeInputConnection[0] === source && activeInputConnection[1] === output
    );
};
