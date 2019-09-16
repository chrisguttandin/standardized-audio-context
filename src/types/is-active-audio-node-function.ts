import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';

export type TIsActiveAudioNodeFunction = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>) => boolean;
