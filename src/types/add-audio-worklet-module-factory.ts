import { TAbortErrorFactory } from './abort-error-factory';
import { TAddAudioWorkletModuleFunction } from './add-audio-worklet-module-function';
import { TFetchSourceFunction } from './fetch-source-function';
import { TGetBackupNativeContextFunction } from './get-backup-native-context-function';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TAddAudioWorkletModuleFactory = (
    createAbortError: TAbortErrorFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    fetchSource: TFetchSourceFunction,
    getBackupNativeContext: TGetBackupNativeContextFunction
) => TAddAudioWorkletModuleFunction;
