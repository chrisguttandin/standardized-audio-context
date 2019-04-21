import { IDelayNode, IDelayOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TDelayNodeConstructor = new <T extends IMinimalBaseAudioContext>(context: T, options?: Partial<IDelayOptions>) => IDelayNode<T>;
