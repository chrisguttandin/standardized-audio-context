import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';

export type TCycleCounters = WeakMap<IAudioNode<IMinimalBaseAudioContext>, number>;
