import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';

export type TIsPartOfACycleFunction = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>) => boolean;
