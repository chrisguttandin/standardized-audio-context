import { IAudioNode } from '../interfaces';
import { TActiveInputConnection, TContext, TPassiveAudioNodeInputConnection } from '../types';
import { insertElementInSet } from './insert-element-in-set';

export const addActiveInputConnectionToAudioNode = <T extends TContext>(
    activeInputs: Set<TActiveInputConnection<T>>[],
    source: IAudioNode<T>,
    [output, input, eventListener]: TPassiveAudioNodeInputConnection,
    ignoreDuplicates: boolean
) => {
    insertElementInSet(
        activeInputs[input],
        [source, output, eventListener],
        (activeInputConnection) => activeInputConnection[0] === source && activeInputConnection[1] === output,
        ignoreDuplicates
    );
};
