import { AUDIO_GRAPHS, CONTEXT_STORE, NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS, NODE_TO_PROCESSOR_MAPS } from '../globals';
import { TContext, TNativeContext } from '../types';
import { disconnectAudioNodeInputConnections } from './disconnect-audio-node-input-connections';

export const deleteAudioGraph = (context: TContext, nativeContext: TNativeContext): void => {
    const audioGraph = AUDIO_GRAPHS.get(context);

    if (audioGraph !== undefined) {
        disconnectAudioNodeInputConnections(audioGraph, context.destination);
    }

    AUDIO_GRAPHS.delete(context);
    AUDIO_GRAPHS.delete(nativeContext);

    CONTEXT_STORE.delete(context);

    NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS.delete(nativeContext);

    NODE_TO_PROCESSOR_MAPS.delete(nativeContext);
};
