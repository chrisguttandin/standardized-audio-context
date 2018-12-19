import { TAudioDestinationNodeConstructor } from './audio-destination-node-constructor';
import { TAudioListenerFactory } from './audio-listener-factory';
import { TMinimalBaseAudioContextConstructor } from './minimal-base-audio-context-constructor';

export type TMinimalBaseAudioContextConstructorFactory = (
    audioDestinationNodeConstructor: TAudioDestinationNodeConstructor,
    createAudioListener: TAudioListenerFactory
) => TMinimalBaseAudioContextConstructor;
