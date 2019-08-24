import { IMinimalBaseAudioContext } from '../interfaces';
import { TAbortErrorFactory } from './abort-error-factory';
import { TAddAudioWorkletModuleFunction } from './add-audio-worklet-module-function';
import { TExposeCurrentFrameAndCurrentTimeFunction } from './expose-current-frame-and-current-time-function';
import { TFetchSourceFunction } from './fetch-source-function';
import { TGetBackupNativeContextFunction } from './get-backup-native-context-function';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TAddAudioWorkletModuleFactory = (
    createAbortError: TAbortErrorFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    exposeCurrentFrameAndCurrentTime: TExposeCurrentFrameAndCurrentTimeFunction,
    fetchSource: TFetchSourceFunction,
    getBackupNativeContext: TGetBackupNativeContextFunction,
    ongoingRequests: WeakMap<IMinimalBaseAudioContext, Map<string, Promise<void>>>, // tslint:disable-line:invalid-void
    resolvedRequests: WeakMap<IMinimalBaseAudioContext, Set<string>>
) => TAddAudioWorkletModuleFunction;
