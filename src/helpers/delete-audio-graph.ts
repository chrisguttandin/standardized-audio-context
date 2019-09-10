import { CONTEXT_STORE, NODE_NAME_TO_PROCESSOR_CONSTRUCTOR_MAPS, NODE_TO_PROCESSOR_MAPS } from '../globals';
import { IMinimalBaseAudioContext } from '../interfaces';
import { TNativeContext } from '../types';
import { disconnectAudioNodeInputConnections } from './disconnect-audio-node-input-connections';

export const deleteAudioGraph = <T extends IMinimalBaseAudioContext>(context: T, nativeContext: TNativeContext): void => {
    disconnectAudioNodeInputConnections(context.destination);

    CONTEXT_STORE.delete(context);
    NODE_NAME_TO_PROCESSOR_CONSTRUCTOR_MAPS.delete(nativeContext);
    NODE_TO_PROCESSOR_MAPS.delete(nativeContext);
};
