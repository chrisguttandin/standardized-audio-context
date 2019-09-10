import { IAudioParam, IAudioParamConnections, IMinimalBaseAudioContext } from '../interfaces';

export type TAudioParamConnectionsStore = WeakMap<IAudioParam, Readonly<IAudioParamConnections<IMinimalBaseAudioContext>>>;
