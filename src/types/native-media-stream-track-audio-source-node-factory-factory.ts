import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TNativeMediaStreamTrackAudioSourceNodeFactory } from './native-media-stream-track-audio-source-node-factory';

export type TNativeMediaStreamTrackAudioSourceNodeFactoryFactory = (
    createInvalidStateError: TInvalidStateErrorFactory
) => TNativeMediaStreamTrackAudioSourceNodeFactory;
