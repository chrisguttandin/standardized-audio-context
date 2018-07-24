import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeChannelSplitterNodeFactory } from './native-channel-splitter-node-factory';

export type TNativeChannelSplitterNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory
) => TNativeChannelSplitterNodeFactory;
