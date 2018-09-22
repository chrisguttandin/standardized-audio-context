import { TTestChannelSplitterNodeChannelCountSupportFactory } from '../types';

/**
 * Firefox up to version 61 had a bug which caused the ChannelSplitterNode to expose a wrong channelCount property.
 */
export const createTestChannelSplitterNodeChannelCountSupport: TTestChannelSplitterNodeChannelCountSupportFactory = (
    nativeOfflineAudioContextConstructor
) => {
    return () => {
        if (nativeOfflineAudioContextConstructor === null) {
            return false;
        }

        const offlineAudioContext = new nativeOfflineAudioContextConstructor(1, 1, 44100);
        const channelSplitterNode = offlineAudioContext.createChannelSplitter(4);

        return (channelSplitterNode.channelCount === 4);
    };
};
