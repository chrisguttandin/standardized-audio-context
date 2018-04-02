import { IIIRFilterNodeConstructor, IIIRFilterNodeRendererConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TIIRFilterNodeConstructorFactory = (
    iIRFilterNodeRendererConstructor: IIIRFilterNodeRendererConstructor,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IIIRFilterNodeConstructor;
