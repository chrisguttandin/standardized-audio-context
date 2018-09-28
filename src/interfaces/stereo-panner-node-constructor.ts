import { TContext } from '../types';
import { IStereoPannerNode } from './stereo-panner-node';
import { IStereoPannerOptions } from './stereo-panner-options';

export interface IStereoPannerNodeConstructor {

    new (context: TContext, options?: Partial<IStereoPannerOptions>): IStereoPannerNode;

}
