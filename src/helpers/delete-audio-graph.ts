import { AUDIO_GRAPHS, CONTEXT_STORE, NODE_NAME_TO_PROCESSOR_CONSTRUCTOR_MAPS, NODE_TO_PROCESSOR_MAPS } from '../globals';
import { IMinimalBaseAudioContext } from '../interfaces';
import { TNativeContext } from '../types';
import { disconnectAudioNodeInputConnections } from './disconnect-audio-node-input-connections';
import { getValueForKey } from './get-value-for-key';

export const deleteAudioGraph = <T extends IMinimalBaseAudioContext>(context: T, nativeContext: TNativeContext): void => {
    const audioGraph = getValueForKey(AUDIO_GRAPHS, context);

    disconnectAudioNodeInputConnections(audioGraph, context.destination);

    AUDIO_GRAPHS.delete(context);

    CONTEXT_STORE.delete(context);

    NODE_NAME_TO_PROCESSOR_CONSTRUCTOR_MAPS.delete(nativeContext);

    NODE_TO_PROCESSOR_MAPS.delete(nativeContext);
};
