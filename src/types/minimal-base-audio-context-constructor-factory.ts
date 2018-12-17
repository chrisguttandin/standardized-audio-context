import { IAudioDestinationNodeConstructor, IMinimalBaseAudioContextConstructor } from '../interfaces';
import { TAudioListenerFactory } from './audio-listener-factory';

export type TMinimalBaseAudioContextConstructorFactory = (
    audioDestinationNodeConstructor: IAudioDestinationNodeConstructor,
    createAudioListener: TAudioListenerFactory
) => IMinimalBaseAudioContextConstructor;
