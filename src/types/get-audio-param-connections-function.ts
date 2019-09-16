import { IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TAudioParamConnections } from './audio-param-connections';

export type TGetAudioParamConnectionsFunction = <T extends IMinimalBaseAudioContext>(audioParam: IAudioParam) => TAudioParamConnections<T>;
