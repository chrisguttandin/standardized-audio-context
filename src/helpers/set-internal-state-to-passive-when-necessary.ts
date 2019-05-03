import { isAudioWorkletNode } from '../guards/audio-worklet-node';
import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { TActiveInputConnection } from '../types';
import { setInternalState } from './set-internal-state';

// Set the internalState of the audioNode to 'passive' if it is not an AudioWorkletNode and if it has no 'active' input connections.
export const setInternalStateToPassiveWhenNecessary = <T extends IMinimalBaseAudioContext>(
    audioNode: IAudioNode<T>,
    activeInputs: Set<TActiveInputConnection<T>>[]
) => {
    if (!isAudioWorkletNode(audioNode) && activeInputs.every((connections) => (connections.size === 0))) {
        setInternalState(audioNode, 'passive');
    }
};
