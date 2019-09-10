import { IAudioParam, IAudioParamRenderer, IMinimalBaseAudioContext, IMinimalOfflineAudioContext } from '../interfaces';

export type TAddAudioParamConnectionsFunction = <T extends IMinimalBaseAudioContext>(
    audioParam: IAudioParam,
    audioParamRenderer: T extends IMinimalOfflineAudioContext ? IAudioParamRenderer : null
) => void;
