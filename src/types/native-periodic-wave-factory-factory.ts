import { TGetBackupNativeContextFunction } from './get-backup-native-context-function';
import { TNativePeriodicWaveFactory } from './native-periodic-wave-factory';

export type TNativePeriodicWaveFactoryFactory = (getBackupNativeContext: TGetBackupNativeContextFunction) => TNativePeriodicWaveFactory;
