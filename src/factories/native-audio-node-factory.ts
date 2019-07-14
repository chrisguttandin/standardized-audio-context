import { TNativeAudioNodeFactoryFactory } from '../types';

export const createNativeAudioNodeFactory: TNativeAudioNodeFactoryFactory = (getBackupNativeContext) => {
    return (nativeContext, factoryFunction) => {
        // Bug #50: Only Edge does currently not allow to create AudioNodes on a closed context yet.
        const backupNativeContext = getBackupNativeContext(nativeContext);

        if (backupNativeContext !== null) {
            return factoryFunction(backupNativeContext);
        }

        return factoryFunction(nativeContext);
    };
};
