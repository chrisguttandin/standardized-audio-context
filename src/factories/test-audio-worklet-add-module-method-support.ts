import { TNativeOfflineAudioContextConstructor } from '../types';

/*
 * Bug #176: Firefox up to version 112 rejected the promise returned by addModule() with an AbortError if the source code contained an
 * import statement.
 *
 * Bug #177: Firefox up to version 112 rejected the promise returned by addModule() with an AbortError if the source code was unparsable.
 */
export const createTestAudioWorkletAddModuleMethodSupport =
    (nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor) => async () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const blob = new Blob(['!'], { type: 'application/javascript; charset=utf-8' });
        const offlineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);
        const url = URL.createObjectURL(blob);

        try {
            await offlineAudioContext.audioWorklet.addModule(url);
        } catch (err) {
            return err instanceof SyntaxError;
        } finally {
            URL.revokeObjectURL(url);
        }

        return false;
    };
