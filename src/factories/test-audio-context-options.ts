import { TTestAudioContextOptionsSupportFactory } from '../types';

export const createTestAudioContextOptionsSupport: TTestAudioContextOptionsSupportFactory = (unpatchedAudioContextConstructor) => {
    return () => {
        if (unpatchedAudioContextConstructor === null) {
            return false;
        }

        let audioContext;

        try {
            audioContext = new unpatchedAudioContextConstructor({ latencyHint: 'balanced' });
        } catch (err) {
            return false;
        }

        audioContext.close();

        return true;
    };
};
