import { IAudioDestinationNode } from '../interfaces';
import { TContext } from './context';

export type TAudioDestinationNodeConstructor = new (context: TContext, channelCount: number) => IAudioDestinationNode;
