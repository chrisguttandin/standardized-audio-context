import { TNativeAudioNode } from './native-audio-node';

export type TNativeMediaStreamTrackAudioSourceNode = typeof globalThis extends { MediaStreamTrackAudioSourceNode: any }
    ? never
    : TNativeAudioNode;
