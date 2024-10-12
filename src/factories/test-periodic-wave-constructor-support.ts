import type { createNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';
import type { createNativePeriodicWaveConstructor } from './native-periodic-wave-constructor';

// Bug #181: Firefox up to version 80 allowed to create a PeriodicWave with only a single element.
export const createTestPeriodicWaveConstructorSupport = (
    nativeOfflineAudioContextConstructor: ReturnType<typeof createNativeOfflineAudioContextConstructor>,
    nativePeriodicWaveConstructor: ReturnType<typeof createNativePeriodicWaveConstructor>
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        if (nativePeriodicWaveConstructor === null) {
            return false;
        }

        const offlineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);

        try {
            // tslint:disable-next-line:no-unused-expression
            new nativePeriodicWaveConstructor(offlineAudioContext, { imag: [1], real: [1] });
        } catch {
            return true;
        }

        return false;
    };
};
