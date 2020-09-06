import { TGetOrCreateBackupOfflineAudioContextFactory } from '../types';

export const createGetOrCreateBackupOfflineAudioContext: TGetOrCreateBackupOfflineAudioContextFactory = (
    backupOfflineAudioContextStore,
    nativeOfflineAudioContextConstructor
) => {
    return (nativeContext) => {
        let backupOfflineAudioContext = backupOfflineAudioContextStore.get(nativeContext);

        if (backupOfflineAudioContext !== undefined) {
            return backupOfflineAudioContext;
        }

        if (nativeOfflineAudioContextConstructor === null) {
            throw new Error('Missing the native OfflineAudioContext constructor.');
        }

        backupOfflineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 8000);

        backupOfflineAudioContextStore.set(nativeContext, backupOfflineAudioContext);

        return backupOfflineAudioContext;
    };
};
