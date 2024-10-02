import { TAddAudioNodeConnectionsFunction } from './add-audio-node-connections-function';
import { TAddConnectionToAudioNodeFunction } from './add-connection-to-audio-node-function';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TDecrementCycleCounterFunction } from './decrement-cycle-counter-function';
import { TDetectCyclesFunction } from './detect-cycles-function';
import { TEventTargetConstructor } from './event-target-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIncrementCycleCounterFactory } from './increment-cycle-counter-factory';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TInvalidAccessErrorFactory } from './invalid-access-error-factory';
import { TIsNativeAudioNodeFunction } from './is-native-audio-node-function';
import { TIsNativeAudioParamFunction } from './is-native-audio-param-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TAudioNodeConstructorFactory = (
    addAudioNodeConnections: TAddAudioNodeConnectionsFunction,
    addConnectionToAudioNode: TAddConnectionToAudioNodeFunction,
    createIncrementCycleCounter: TIncrementCycleCounterFactory,
    createIndexSizeError: TIndexSizeErrorFactory,
    createInvalidAccessError: TInvalidAccessErrorFactory,
    decrementCycleCounter: TDecrementCycleCounterFunction,
    detectCycles: TDetectCyclesFunction,
    eventTargetConstructor: TEventTargetConstructor,
    getNativeContext: TGetNativeContextFunction,
    isNativeAudioNode: TIsNativeAudioNodeFunction,
    isNativeAudioParam: TIsNativeAudioParamFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TAudioNodeConstructor;
