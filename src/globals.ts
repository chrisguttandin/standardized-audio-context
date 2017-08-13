import { IAudioNode, IAudioNodeRenderer, IMinimalBaseAudioContext } from './interfaces';
import { TNativeAudioNode, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from './types';

export const AUDIO_NODE_STORE: WeakMap<IAudioNode, TNativeAudioNode> = new WeakMap();

export const CONTEXT_STORE: WeakMap<IMinimalBaseAudioContext, (TUnpatchedAudioContext | TUnpatchedOfflineAudioContext)> = new WeakMap();

export const DETACHED_ARRAY_BUFFERS: WeakSet<ArrayBuffer> = new WeakSet();

export const RENDERER_STORE: WeakMap<IAudioNode, IAudioNodeRenderer> = new WeakMap();
