import { TContext } from '../types';
import { IAudioDestinationNode } from './audio-destination-node';

export interface IAudioDestinationNodeConstructor {

    new (context: TContext, channelCount: number): IAudioDestinationNode;

}
