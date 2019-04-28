import { isAudioWorkletNode } from '../guards/audio-worklet-node';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { TInternalStateEventListener } from '../types';
import { setInternalState } from './set-internal-state';

// Set the internalState of the audioNode to 'passive' if it is not an AudioWorkletNode and if it has only 'passive' connections.
export const setInternalStateToPassiveWhenNecessary = <T extends IMinimalBaseAudioContext>(
    audioNode: IAudioNode<T>,
    inputs: Set<[ symbol | IAudioNode<T>, null | TInternalStateEventListener, number ]>[]
) => {
    if (!isAudioWorkletNode(audioNode) && inputs.every((connections) => {
        return Array
            .from(connections)
            .every(([ audioNodeOrSymbol ]) => typeof audioNodeOrSymbol === 'symbol');
    })) {
        setInternalState(audioNode, 'passive');
    }
};
