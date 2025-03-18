import { IAudioParam } from '../interfaces';
import { TAddAudioParamConnectionsFactory } from '../types';

export const createAddAudioParamConnections: TAddAudioParamConnectionsFactory = (audioParamConnectionsStore) => {
    return (audioParam: IAudioParam) => {
        audioParamConnectionsStore.set(audioParam, { activeInputs: new Set(), passiveInputs: new WeakMap() });
    };
};
