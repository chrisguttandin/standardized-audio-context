import { SetOptional } from 'type-fest';
import { TNativeMediaStreamTrackAudioSourceNode } from './native-media-stream-track-audio-source-node';
import { TWithAdditionalProperty } from './with-additional-property';

// Bug #121: Only Firefox does yet support the MediaStreamTrackAudioSourceNode which is why it is marked as optional.
export type TNativeAudioContext = SetOptional<
    TWithAdditionalProperty<
        AudioContext,
        'createMediaStreamTrackSource',
        (mediaStreamTrack: MediaStreamTrack) => TNativeMediaStreamTrackAudioSourceNode
    >,
    'createMediaStreamTrackSource'
>;
