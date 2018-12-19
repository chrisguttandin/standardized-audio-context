import { TAudioParamFactory } from './audio-param-factory';
import { TDynamicsCompressorNodeConstructor } from './dynamics-compressor-node-constructor';
import { TDynamicsCompressorNodeRendererFactory } from './dynamics-compressor-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeDynamicsCompressorNodeFactory } from './native-dynamics-compressor-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TDynamicsCompressorNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createDynamicsCompressorNodeRenderer: TDynamicsCompressorNodeRendererFactory,
    createNativeDynamicsCompressorNode: TNativeDynamicsCompressorNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TDynamicsCompressorNodeConstructor;
