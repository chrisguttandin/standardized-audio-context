import { IAudioDestinationNode } from './audio-destination-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioDestinationNodeConstructor {

    new (
        context: IMinimalBaseAudioContext,
        channelCount: number
    ): IAudioDestinationNode;

}
