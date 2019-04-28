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
    TAnyContext,
    TInternalState,
    TInternalStateEventListener,
    TNativeAudioNode,
    TNativeAudioParam,
    TNativeAudioWorkletNode,
    TNativeContext
} from './types';

export const AUDIO_NODE_STATE_STORE: WeakMap<IAudioNode<IMinimalBaseAudioContext>, TInternalState> = new WeakMap();

export const AUDIO_NODE_STORE: WeakMap<IAudioNode<IMinimalBaseAudioContext>, TNativeAudioNode | INativeAudioNodeFaker> = new WeakMap();

export const AUDIO_NODE_SYMBOL_STORE: WeakMap<IAudioNode<IMinimalBaseAudioContext>, symbol> = new WeakMap();

export const AUDIO_GRAPHS: WeakMap<TAnyContext, IAudioGraph<IMinimalBaseAudioContext>> = new WeakMap();

export const AUDIO_PARAM_STORE: WeakMap<IAudioParam, TNativeAudioParam> = new WeakMap();

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
