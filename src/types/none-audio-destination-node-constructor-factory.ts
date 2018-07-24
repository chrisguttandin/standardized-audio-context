import { IAudioNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';

export type TNoneAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor: IAudioNodeConstructor
) => INoneAudioDestinationNodeConstructor;
