import { TGetBackupNativeContextFunction } from './get-backup-native-context-function';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TNativePeriodicWaveFactory } from './native-periodic-wave-factory';

export type TNativePeriodicWaveFactoryFactory = (
    createIndexSizeError: TIndexSizeErrorFactory,
    getBackupNativeContext: TGetBackupNativeContextFunction
) => TNativePeriodicWaveFactory;
