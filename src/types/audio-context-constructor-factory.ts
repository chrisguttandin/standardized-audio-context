import { TAudioContextConstructor } from './audio-context-constructor';
import { TBaseAudioContextConstructor } from './base-audio-context-constructor';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TMediaElementAudioSourceNodeConstructor } from './media-element-audio-source-node-constructor';
import { TMediaStreamAudioDestinationNodeConstructor } from './media-stream-audio-destination-node-constructor';
import { TMediaStreamAudioSourceNodeConstructor } from './media-stream-audio-source-node-constructor';
import { TMediaStreamTrackAudioSourceNodeConstructor } from './media-stream-track-audio-source-node-constructor';
import { TNativeAudioContextConstructor } from './native-audio-context-constructor';

export type TAudioContextConstructorFactory = (
    baseAudioContextConstructor: TBaseAudioContextConstructor,
    createInvalidStateError: TInvalidStateErrorFactory,
    mediaElementAudioSourceNodeConstructor: TMediaElementAudioSourceNodeConstructor,
    mediaStreamAudioDestinationNodeConstructor: TMediaStreamAudioDestinationNodeConstructor,
    mediaStreamAudioSourceNodeConstructor: TMediaStreamAudioSourceNodeConstructor,
    mediaStreamTrackAudioSourceNodeConstructor: TMediaStreamTrackAudioSourceNodeConstructor,
    nativeAudioContextConstructor: null | TNativeAudioContextConstructor
) => TAudioContextConstructor;
