import { IIIRFilterOptions, INativeIIRFilterNodeFaker } from '../interfaces';
import { TNativeContext } from './native-context';

export type TNativeIIRFilterNodeFakerFactory = (nativeContext: TNativeContext, options: IIIRFilterOptions) => INativeIIRFilterNodeFaker;
