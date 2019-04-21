import { IIIRFilterNode, IIIRFilterOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TIIRFilterNodeConstructor =  new <T extends IMinimalBaseAudioContext>(
    context: T,
    options: { feedback: IIIRFilterOptions['feedback']; feedforward: IIIRFilterOptions['feedforward'] } & Partial<IIIRFilterOptions>
) => IIIRFilterNode<T>;
