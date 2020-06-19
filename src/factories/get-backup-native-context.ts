import { BACKUP_NATIVE_CONTEXT_STORE } from '../globals';
import { TGetBackupNativeContextFactory, TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const createGetBackupNativeContext: TGetBackupNativeContextFactory = (
    isNativeOfflineAudioContext,
    nativeAudioContextConstructor,
    nativeOfflineAudioContextConstructor
) => {
    return <T extends TNativeAudioContext | TNativeOfflineAudioContext>(nativeContext: T): null | T => {
        /*
         * Bug #50: Only Edge does currently not allow to create AudioNodes on a closed context yet which is why there needs to be no
         * backupNativeContext in that case.
         */
        if (
            nativeContext.state === 'closed' &&
            nativeAudioContextConstructor !== null &&
            nativeAudioContextConstructor.name !== 'webkitAudioContext'
        ) {
            if (isNativeOfflineAudioContext(nativeContext)) {
                const backupNativeContext = BACKUP_NATIVE_CONTEXT_STORE.get(nativeContext);

                if (backupNativeContext !== undefined) {
                    return <T>backupNativeContext;
                }

                if (nativeOfflineAudioContextConstructor !== null) {
                    // @todo Copy the attached AudioWorkletProcessors and other settings.
                    const bckpNtveCntxt = new nativeOfflineAudioContextConstructor(1, 1, 44100);

                    BACKUP_NATIVE_CONTEXT_STORE.set(nativeContext, bckpNtveCntxt);

                    return <T>bckpNtveCntxt;
                }
            } else {
                const backupNativeContext = BACKUP_NATIVE_CONTEXT_STORE.get(nativeContext);

                if (backupNativeContext !== undefined) {
                    return <T>backupNativeContext;
                }

                // @todo Copy the attached AudioWorkletProcessors and other settings.
                const bckpNtveCntxt = new nativeAudioContextConstructor();

                BACKUP_NATIVE_CONTEXT_STORE.set(nativeContext, bckpNtveCntxt);

                return <T>bckpNtveCntxt;
            }
        }

        return null;
    };
};
