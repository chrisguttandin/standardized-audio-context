import { IIIRFilterNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TIIRFilterNodeRendererFactory } from './iir-filter-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeIIRFilterNodeFactory } from './native-iir-filter-node-factory';

export type TIIRFilterNodeConstructorFactory = (
    createNativeIIRFilterNode: TNativeIIRFilterNodeFactory,
    createIIRFilterNodeRenderer: TIIRFilterNodeRendererFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IIIRFilterNodeConstructor;
