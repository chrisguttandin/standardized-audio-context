import { IAudioNode, IAudioNodeRenderer, IAudioParam, IAudioParamRenderer, IMinimalBaseAudioContext } from './interfaces';
import { TNativeAudioNode, TNativeAudioParam, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from './types';

export const AUDIO_NODE_RENDERER_STORE: WeakMap<IAudioNode, IAudioNodeRenderer> = new WeakMap();

export const AUDIO_NODE_STORE: WeakMap<IAudioNode, TNativeAudioNode> = new WeakMap();

export const AUDIO_PARAM_RENDERER_STORE: WeakMap<IAudioParam, IAudioParamRenderer> = new WeakMap();

export const AUDIO_PARAM_STORE: WeakMap<IAudioParam, TNativeAudioParam> = new WeakMap();

export const CONTEXT_STORE: WeakMap<IMinimalBaseAudioContext, (TUnpatchedAudioContext | TUnpatchedOfflineAudioContext)> = new WeakMap();

export const DETACHED_ARRAY_BUFFERS: WeakSet<ArrayBuffer> = new WeakSet();
