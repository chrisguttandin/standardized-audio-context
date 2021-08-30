import { TNativeMediaStreamTrackAudioSourceNode } from './native-media-stream-track-audio-source-node';

export type TNativeAudioContext = AudioContext & {
    // @todo TypeScript v4.4 doesn't come with definitions for the MediaStreamTrackAudioSourceNode anymore.
    createMediaStreamTrackSource(mediaStreamTrack: MediaStreamTrack): TNativeMediaStreamTrackAudioSourceNode;
};
