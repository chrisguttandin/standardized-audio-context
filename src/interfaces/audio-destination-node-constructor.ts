import { TStandardizedContext } from '../types';
import { IAudioDestinationNode } from './audio-destination-node';

export interface IAudioDestinationNodeConstructor {

    new (context: TStandardizedContext, channelCount: number): IAudioDestinationNode;

}
