import { TStandardizedContext } from '../types';
import { IIIRFilterNode } from './iir-filter-node';
import { IIIRFilterOptions } from './iir-filter-options';

export interface IIIRFilterNodeConstructor {

    new (
        context: TStandardizedContext,
        options: { feedback: IIIRFilterOptions['feedback']; feedforward: IIIRFilterOptions['feedforward'] } & Partial<IIIRFilterOptions>
    ): IIIRFilterNode;

}
