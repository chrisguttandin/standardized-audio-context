import { IIIRFilterNodeConstructor, IIIRFilterNodeRendererConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeIIRFilterNodeFactory } from './native-iir-filter-node-factory';

export type TIIRFilterNodeConstructorFactory = (
    createNativeIIRFilterNode: TNativeIIRFilterNodeFactory,
    iIRFilterNodeRendererConstructor: IIIRFilterNodeRendererConstructor,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IIIRFilterNodeConstructor;
