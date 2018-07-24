import { TGetBackupNativeContextFunction } from './get-backup-native-context-function';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';

export type TNativeAudioNodeFactoryFactory = (getBackupNativeContext: TGetBackupNativeContextFunction) => TNativeAudioNodeFactory;
