import { IAudioNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';

export type TNoneAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor: IAudioNodeConstructor,
    createInvalidStateError: TInvalidStateErrorFactory
) => INoneAudioDestinationNodeConstructor;
