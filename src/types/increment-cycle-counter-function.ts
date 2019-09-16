import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';

export type TIncrementCycleCounterFunction = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>, count: number) => void;
