import type { createChannelMergerNodeRendererFactory } from '../factories/channel-merger-node-renderer-factory';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TChannelMergerNodeConstructor } from './channel-merger-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';

export type TChannelMergerNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createChannelMergerNodeRenderer: ReturnType<typeof createChannelMergerNodeRendererFactory>,
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TChannelMergerNodeConstructor;
