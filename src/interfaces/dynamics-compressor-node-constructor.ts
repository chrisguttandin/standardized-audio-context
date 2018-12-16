import { TContext } from '../types';
import { IDynamicsCompressorNode } from './dynamics-compressor-node';
import { IDynamicsCompressorOptions } from './dynamics-compressor-options';

export interface IDynamicsCompressorNodeConstructor {

    new (context: TContext, options?: Partial<IDynamicsCompressorOptions>): IDynamicsCompressorNode;

}
