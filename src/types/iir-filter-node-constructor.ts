import { IIIRFilterNode, IIIRFilterOptions } from '../interfaces';
import { TContext } from './context';

export type TIIRFilterNodeConstructor =  new (
    context: TContext,
    options: { feedback: IIIRFilterOptions['feedback']; feedforward: IIIRFilterOptions['feedforward'] } & Partial<IIIRFilterOptions>
) => IIIRFilterNode;
