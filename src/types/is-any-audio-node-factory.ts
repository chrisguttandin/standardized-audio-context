import { TAudioNodeStore } from './audio-node-store';
import { TIsAnyAudioNodeFunction } from './is-any-audio-node-function';

export type TIsAnyAudioNodeFactory = (audioNodeStore: TAudioNodeStore, window: null | Window) => TIsAnyAudioNodeFunction;
