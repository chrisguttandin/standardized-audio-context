import { TTestChannelMergerNodeChannelCountSupportFactory } from '../types';

/**
 * Firefox up to version 69 did not throw an error when setting a different channelCount or channelCountMode.
 */
export const createTestChannelMergerNodeChannelCountSupport: TTestChannelMergerNodeChannelCountSupportFactory = (
    nativeOfflineAudioContextConstructor
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const offlineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);
        const nativeChannelMergerNode = offlineAudioContext.createChannelMerger();

        try {
            nativeChannelMergerNode.channelCount = 2;
        } catch {
            return true;
        }

        return false;
    };
};
