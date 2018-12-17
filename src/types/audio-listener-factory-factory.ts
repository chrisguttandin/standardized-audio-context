import { TAudioListenerFactory } from './audio-listener-factory';
import { TAudioParamFactory } from './audio-param-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeChannelMergerNodeFactory } from './native-channel-merger-node-factory';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';
import { TNativeScriptProcessorNodeFactory } from './native-script-processor-node-factory';

export type TAudioListenerFactoryFactory = (
    createAudioParam: TAudioParamFactory,
    createNativeChannelMergerNode: TNativeChannelMergerNodeFactory,
    createNativeConstantSourceNode: TNativeConstantSourceNodeFactory,
    createNativeScriptProcessorNode: TNativeScriptProcessorNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TAudioListenerFactory;
