import { IBiquadFilterNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TBiquadFilterNodeRendererFactory } from './biquad-filter-node-renderer-factory';
import { TInvalidAccessErrorFactory } from './invalid-access-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeBiquadFilterNodeFactory } from './native-biquad-filter-node-factory';

export type TBiquadFilterNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createBiquadFilterNodeRenderer: TBiquadFilterNodeRendererFactory,
    createInvalidAccessError: TInvalidAccessErrorFactory,
    createNativeBiquadFilterNode: TNativeBiquadFilterNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IBiquadFilterNodeConstructor;
