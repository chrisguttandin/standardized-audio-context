import { IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TAudioParamConnections } from './audio-param-connections';

export type TAudioParamConnectionsStore = WeakMap<IAudioParam, TAudioParamConnections<IMinimalBaseAudioContext>>;
