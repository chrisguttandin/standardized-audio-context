import { IBiquadFilterNode, IBiquadFilterOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TBiquadFilterNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IBiquadFilterOptions>
) => IBiquadFilterNode<T>;
