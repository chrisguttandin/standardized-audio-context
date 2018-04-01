import { TTestAudioContextCloseMethodSupportFactory } from '../types';

export const createTestAudioContextCloseMethodSupport: TTestAudioContextCloseMethodSupportFactory = (unpatchedAudioContextConstructor) => {
    return () => {
        if (unpatchedAudioContextConstructor === null) {
            return false;
        }

        // Try to check the prototype before constructing the AudioContext.
        if (unpatchedAudioContextConstructor.prototype !== undefined &&
                unpatchedAudioContextConstructor.prototype.close !== undefined) {
            return true;
        }

        const audioContext = new unpatchedAudioContextConstructor();

        const isAudioContextClosable = (audioContext.close !== undefined);

        try {
            audioContext.close();
        } catch (err) {
            // Ignore errors.
        }

        return isAudioContextClosable;
    };
};
