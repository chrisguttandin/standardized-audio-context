import {
    IAudioNode,
    IAudioNodeRenderer,
    IAudioParam,
    IAudioParamRenderer,
    IAudioWorkletProcessorConstructor,
    IMinimalBaseAudioContext,
    INativeAudioNodeFaker
} from './interfaces';
import { TNativeAudioNode, TNativeAudioParam, TUnpatchedAudioContext, TUnpatchedOfflineAudioContext } from './types';

export const AUDIO_NODE_RENDERER_DESTINATIONS_STORE: WeakMap<IAudioNodeRenderer, Set<IAudioNodeRenderer>> = new WeakMap();

export const AUDIO_NODE_RENDERER_STORE: WeakMap<IAudioNode, IAudioNodeRenderer> = new WeakMap();

export const AUDIO_NODE_STORE: WeakMap<IAudioNode, TNativeAudioNode | INativeAudioNodeFaker> = new WeakMap();

export const AUDIO_PARAM_CONTEXT_STORE: WeakMap<IAudioParam, IMinimalBaseAudioContext> = new WeakMap();

export const AUDIO_PARAM_RENDERER_STORE: WeakMap<IAudioParam, IAudioParamRenderer> = new WeakMap();

export const AUDIO_PARAM_STORE: WeakMap<IAudioParam, TNativeAudioParam> = new WeakMap();

export const CONTEXT_STORE: WeakMap<IMinimalBaseAudioContext, (TUnpatchedAudioContext | TUnpatchedOfflineAudioContext)> = new WeakMap();

export const DETACHED_ARRAY_BUFFERS: WeakSet<ArrayBuffer> = new WeakSet();

// This clunky name is borrowed from the spec. :-)
export const NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS: WeakMap<
    TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    Map<string, IAudioWorkletProcessorConstructor>
> = new WeakMap();
