import { IMinimalBaseAudioContext, IOscillatorNode, IOscillatorOptions } from '../interfaces';

export type TOscillatorNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IOscillatorOptions>
) => IOscillatorNode<T>;
