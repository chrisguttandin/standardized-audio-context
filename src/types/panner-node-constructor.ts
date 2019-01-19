import { IPannerNode, IPannerOptions } from '../interfaces';
import { TContext } from './context';

export type TPannerNodeConstructor = new (context: TContext, options?: Partial<IPannerOptions>) => IPannerNode;
