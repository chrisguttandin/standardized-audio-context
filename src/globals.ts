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

export interface IAudioNodeConnections {

    inputs: Set<[ IAudioNode, number, number ]>;

    outputs: Set<[ IAudioNode, number, number ] | [ IAudioParam, number ]>;

    renderer: IAudioNodeRenderer;

}

export interface IAudioParamConnections {

    inputs: Set<[ IAudioNode, number ]>;

    renderer: IAudioParamRenderer;

}

export interface IAudioGraph {

    nodes: WeakMap<IAudioNode, IAudioNodeConnections>;

    params: WeakMap<IAudioParam, IAudioParamConnections>;

}

export const AUDIO_NODE_STORE: WeakMap<IAudioNode, TNativeAudioNode | INativeAudioNodeFaker> = new WeakMap();

export const AUDIO_GRAPH: WeakMap<IMinimalBaseAudioContext, IAudioGraph> = new WeakMap();

export const AUDIO_PARAM_STORE: WeakMap<IAudioParam, TNativeAudioParam> = new WeakMap();

export const CONTEXT_STORE: WeakMap<IMinimalBaseAudioContext, (TUnpatchedAudioContext | TUnpatchedOfflineAudioContext)> = new WeakMap();

export const DETACHED_ARRAY_BUFFERS: WeakSet<ArrayBuffer> = new WeakSet();

// This clunky name is borrowed from the spec. :-)
export const NODE_NAME_TO_PROCESSOR_DEFINITION_MAPS: WeakMap<
    TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    Map<string, IAudioWorkletProcessorConstructor>
> = new WeakMap();

export const TEST_RESULTS: WeakMap<object, boolean> = new WeakMap();
