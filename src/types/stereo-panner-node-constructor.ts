import { IStereoPannerNode, IStereoPannerOptions } from '../interfaces';
import { TContext } from './context';

export type TStereoPannerNodeConstructor = new (context: TContext, options?: Partial<IStereoPannerOptions>) => IStereoPannerNode;
