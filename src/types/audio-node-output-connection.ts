import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';

export type TAudioNodeOutputConnection<T extends IMinimalBaseAudioContext> = [ IAudioNode<T>, number, number ];
