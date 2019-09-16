import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';

export type TDecrementCycleCounterFunction = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>, count: number) => void;
