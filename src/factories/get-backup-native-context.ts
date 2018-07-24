import { BACKUP_NATIVE_CONTEXT_STORE } from '../globals';
import { TGetBackupNativeContextFactory } from '../types';

export const createGetBackupNativeContext: TGetBackupNativeContextFactory = (
    isNativeOfflineAudioContext,
    nativeAudioContextConstructor,
    nativeOfflineAudioContextConstructor
) => {
    return (nativeContext) => {
        /*
         * Bug #50: Only Safari does currently allow to create AudioNodes on a closed context yet which is why there needs to be no
         * backupNativeContext in that case.
         */
        if (nativeContext.state === 'closed' && !window.hasOwnProperty('webkitAudioContext')) {
            if (isNativeOfflineAudioContext(nativeContext)) {
                const backupNativeContext = BACKUP_NATIVE_CONTEXT_STORE.get(nativeContext);

                if (backupNativeContext !== undefined) {
                    return backupNativeContext;
                }

                if (nativeOfflineAudioContextConstructor !== null) {
                    // @todo Copy the attached AudioWorkletProcessors and other settings.
                    const bckpNtveCntxt = new nativeOfflineAudioContextConstructor(1, 1, 44100);

                    BACKUP_NATIVE_CONTEXT_STORE.set(nativeContext, bckpNtveCntxt);

                    return bckpNtveCntxt;
                }
            } else {
                const backupNativeContext = BACKUP_NATIVE_CONTEXT_STORE.get(nativeContext);

                if (backupNativeContext !== undefined) {
                    return backupNativeContext;
                }

                if (nativeAudioContextConstructor !== null) {
                    // @todo Copy the attached AudioWorkletProcessors and other settings.
                    const bckpNtveCntxt = new nativeAudioContextConstructor();

                    BACKUP_NATIVE_CONTEXT_STORE.set(nativeContext, bckpNtveCntxt);

                    return bckpNtveCntxt;
                }
            }
        }

        return null;
    };
};
