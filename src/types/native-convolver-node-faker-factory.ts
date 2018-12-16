import { IConvolverOptions, INativeConvolverNodeFaker } from '../interfaces';
import { TNativeContext } from './native-context';

export type TNativeConvolverNodeFakerFactory = (nativeContext: TNativeContext, options: IConvolverOptions) => INativeConvolverNodeFaker;
