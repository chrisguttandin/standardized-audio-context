import { IAudioDestinationNodeConstructor, IMinimalBaseAudioContextConstructor } from '../interfaces';

export type TMinimalBaseAudioContextConstructorFactory = (
    audioDestinationNodeConstructor: IAudioDestinationNodeConstructor
) => IMinimalBaseAudioContextConstructor;
