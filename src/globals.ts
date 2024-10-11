import { IAudioNode } from './interfaces';
import {
    TAudioNodeConnectionsStore,
    TAudioNodeStore,
    TAudioParamConnectionsStore,
    TAudioParamStore,
    TContext,
    TContextStore,
    TCycleCounters,
    TInternalStateEventListener
} from './types';

export const ACTIVE_AUDIO_NODE_STORE: WeakSet<IAudioNode<TContext>> = new WeakSet();

export const AUDIO_NODE_CONNECTIONS_STORE: TAudioNodeConnectionsStore = new WeakMap();

export const AUDIO_NODE_STORE: TAudioNodeStore = new WeakMap();

export const AUDIO_PARAM_CONNECTIONS_STORE: TAudioParamConnectionsStore = new WeakMap();

export const AUDIO_PARAM_STORE: TAudioParamStore = new WeakMap();

export const CONTEXT_STORE: TContextStore = new WeakMap();

export const EVENT_LISTENERS: WeakMap<IAudioNode<TContext>, Set<TInternalStateEventListener>> = new WeakMap();

export const CYCLE_COUNTERS: TCycleCounters = new WeakMap();
