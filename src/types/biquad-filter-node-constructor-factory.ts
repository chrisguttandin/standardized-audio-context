import { TAudioParamFactory } from './audio-param-factory';
import { TBiquadFilterNodeConstructor } from './biquad-filter-node-constructor';
import { TBiquadFilterNodeRendererFactory } from './biquad-filter-node-renderer-factory';
import { TInvalidAccessErrorFactory } from './invalid-access-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeBiquadFilterNodeFactory } from './native-biquad-filter-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TBiquadFilterNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createBiquadFilterNodeRenderer: TBiquadFilterNodeRendererFactory,
    createInvalidAccessError: TInvalidAccessErrorFactory,
    createNativeBiquadFilterNode: TNativeBiquadFilterNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TBiquadFilterNodeConstructor;
