import { IMinimalBaseAudioContext } from '../interfaces';
import { TAbortErrorFactory } from './abort-error-factory';
import { TAddAudioWorkletModuleFunction } from './add-audio-worklet-module-function';
import { TFetchSourceFunction } from './fetch-source-function';
import { TGetBackupNativeContextFunction } from './get-backup-native-context-function';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TAddAudioWorkletModuleFactory = (
    createAbortError: TAbortErrorFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    fetchSource: TFetchSourceFunction,
    getBackupNativeContext: TGetBackupNativeContextFunction,
    ongoingRequests: WeakMap<IMinimalBaseAudioContext, Map<string, Promise<void>>>,
    resolvedRequests: WeakMap<IMinimalBaseAudioContext, Set<string>>
) => TAddAudioWorkletModuleFunction;
