import { TAudioNodeConstructor } from './audio-node-constructor';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TNoneAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor
) => TNoneAudioDestinationNodeConstructor;
