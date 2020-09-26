import { IAudioNode } from '../interfaces';
import { TActiveInputConnection, TContext, TPassiveAudioNodeInputConnection } from '../types';
import { insertElementInSet } from './insert-element-in-set';

export const addPassiveInputConnectionToAudioNode = <T extends TContext>(
    passiveInputs: WeakMap<IAudioNode<T>, Set<TPassiveAudioNodeInputConnection>>,
    input: number,
    [source, output, eventListener]: TActiveInputConnection<T>,
    ignoreDuplicates: boolean
) => {
    const passiveInputConnections = passiveInputs.get(source);

    if (passiveInputConnections === undefined) {
        passiveInputs.set(source, new Set([[output, input, eventListener]]));
    } else {
        insertElementInSet(
            passiveInputConnections,
            [output, input, eventListener],
            (passiveInputConnection) => passiveInputConnection[0] === output && passiveInputConnection[1] === input,
            ignoreDuplicates
        );
    }
};
