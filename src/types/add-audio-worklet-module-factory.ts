import { TAddAudioWorkletModuleFunction } from './add-audio-worklet-module-function';
import { TContext } from './context';
import { TEvaluateSourceFunction } from './evaluate-source-function';
import { TExposeCurrentFrameAndCurrentTimeFunction } from './expose-current-frame-and-current-time-function';
import { TFetchSourceFunction } from './fetch-source-function';
import { TGetBackupNativeContextFunction } from './get-backup-native-context-function';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TAddAudioWorkletModuleFactory = (
    createNotSupportedError: TNotSupportedErrorFactory,
    evaluateSource: TEvaluateSourceFunction,
    exposeCurrentFrameAndCurrentTime: TExposeCurrentFrameAndCurrentTimeFunction,
    fetchSource: TFetchSourceFunction,
    getBackupNativeContext: TGetBackupNativeContextFunction,
    getNativeContext: TGetNativeContextFunction,
    ongoingRequests: WeakMap<TContext, Map<string, Promise<void>>>,
    resolvedRequests: WeakMap<TContext, Set<string>>,
    window: Window
) => TAddAudioWorkletModuleFunction;
