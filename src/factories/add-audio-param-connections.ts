import { IAudioParam, IAudioParamRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';
import { TAddAudioParamConnectionsFactory } from '../types';

export const createAddAudioParamConnections: TAddAudioParamConnectionsFactory = (audioParamConnectionsStore) => {
    return <T extends IMinimalBaseAudioContext>(
        audioParam: IAudioParam,
        audioParamRenderer: T extends IMinimalOfflineAudioContext ? IAudioParamRenderer : null
    ) => {
        audioParamConnectionsStore.set(
            audioParam,
            { activeInputs: new Set(), passiveInputs: new WeakMap(), renderer: audioParamRenderer }
        );
    };
};
