import { TNativeAudioContextConstructor } from '../types';

export const createTestAudioContextGetOutputTimestampSupport = (nativeAudioContextConstructor: null | TNativeAudioContextConstructor) => {
    return () => {
        if (nativeAudioContextConstructor === null) {
            return Promise.resolve(false);
        }

        const audioContext = new nativeAudioContextConstructor();

        /*
         * Bug #38: Chrome up to version 56, Firefox up to version 69, and Safari up to version 13.1 had no getOutputTimestamp()
         * implementation of an AudioContext.
         */
        if (audioContext.getOutputTimestamp === undefined) {
            audioContext.close();

            return Promise.resolve(false);
        }

        // Bug #198: Safari up to version 17.3 divided the contextTime by the sampleRate of the AudioContext.
        return new Promise<boolean>((resolve) => {
            const interval = setInterval(() => {
                const { contextTime } = audioContext.getOutputTimestamp();

                if (typeof contextTime === 'number' && contextTime > 0) {
                    const { currentTime, sampleRate } = audioContext;

                    if (currentTime > 0) {
                        clearInterval(interval);
                        audioContext.close();
                        resolve(Math.abs(contextTime * sampleRate - currentTime) > Math.abs(contextTime - currentTime));
                    }
                }
            });
        });
    };
};
