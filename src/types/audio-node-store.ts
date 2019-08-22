import { IAudioNode, IMinimalBaseAudioContext, INativeAudioNodeFaker } from '../interfaces';
import { TNativeAudioNode } from './native-audio-node';

export type TAudioNodeStore = WeakMap<IAudioNode<IMinimalBaseAudioContext>, TNativeAudioNode | INativeAudioNodeFaker>;
