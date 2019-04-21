import { IGainNode, IGainOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TGainNodeConstructor = new <T extends IMinimalBaseAudioContext>(context: T, options?: Partial<IGainOptions>) => IGainNode<T>;
