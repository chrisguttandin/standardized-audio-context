import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';
import { TWrapChannelMergerNodeFunction } from './wrap-channel-merger-node-function';

export type TNativeChannelMergerNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    wrapChannelMergerNode: TWrapChannelMergerNodeFunction
) => TNativeChannelMergerNodeFactory;
