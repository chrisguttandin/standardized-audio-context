import { IAudioNode, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';

export type TAudioParamAudioNodeStore = WeakMap<IAudioParam, IAudioNode<IMinimalBaseAudioContext>>;
