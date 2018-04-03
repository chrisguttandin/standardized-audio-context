import { IBiquadFilterNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TAudioParamFactory } from './audio-param-factory';
import { TInvalidAccessErrorFactory } from './invalid-access-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeBiquadFilterNodeFactory } from './native-biquad-filter-node-factory';

export type TBiquadFilterNodeConstructorFactory = (
    createAudioParam: TAudioParamFactory,
    createInvalidAccessError: TInvalidAccessErrorFactory,
    createNativeBiquadFilterNode: TNativeBiquadFilterNodeFactory,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IBiquadFilterNodeConstructor;
