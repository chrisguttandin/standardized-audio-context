import {
    IAudioGraph,
    IAudioNode,
    IAudioParam,
    IAudioWorkletProcessor,
    IAudioWorkletProcessorConstructor,
    IMinimalBaseAudioContext,
    INativeAudioNodeFaker
} from './interfaces';
import {
    TInternalStateEventListener,
    TNativeAudioNode,
    TNativeAudioParam,
    TNativeAudioWorkletNode,
    TNativeContext,
    TNativeGainNode
} from './types';

export const ACTIVE_AUDIO_NODE_STORE: WeakSet<IAudioNode<IMinimalBaseAudioContext>> = new WeakSet();

export const AUDIO_NODE_STORE: WeakMap<IAudioNode<IMinimalBaseAudioContext>, TNativeAudioNode | INativeAudioNodeFaker> = new WeakMap();

export const AUDIO_GRAPHS: WeakMap<IMinimalBaseAudioContext, IAudioGraph<IMinimalBaseAudioContext>> = new WeakMap();

export const AUDIO_PARAM_STORE: WeakMap<IAudioParam, TNativeAudioParam> = new WeakMap();

export const AUDIO_PARAM_AUDIO_NODE_STORE: WeakMap<IAudioParam, IAudioNode<IMinimalBaseAudioContext>> = new WeakMap();

export const AUXILIARY_GAIN_NODE_STORE: WeakMap<TNativeAudioWorkletNode, Map<number, TNativeGainNode>> = new WeakMap();

export const BACKUP_NATIVE_CONTEXT_STORE: WeakMap<TNativeContext, TNativeContext> = new WeakMap();

export const CONTEXT_STORE: WeakMap<IMinimalBaseAudioContext, TNativeContext> = new WeakMap();

export const DETACHED_ARRAY_BUFFERS: WeakSet<ArrayBuffer> = new WeakSet();

export const EVENT_LISTENERS: WeakMap<IAudioNode<IMinimalBaseAudioContext>, Set<TInternalStateEventListener>> = new WeakMap();

// This clunky name is borrowed from the spec. :-)
export const NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS: WeakMap<
    TNativeContext,
    Map<string, IAudioWorkletProcessorConstructor>
> = new WeakMap();

export const NODE_TO_PROCESSOR_MAPS: WeakMap<
    TNativeContext,
    WeakMap<TNativeAudioWorkletNode, Promise<IAudioWorkletProcessor>>
> = new WeakMap();

export const TEST_RESULTS: WeakMap<object, boolean> = new WeakMap();
