import { TIIRFilterNodeConstructor } from './iir-filter-node-constructor';
import { TIIRFilterNodeRendererFactory } from './iir-filter-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeIIRFilterNodeFactory } from './native-iir-filter-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TIIRFilterNodeConstructorFactory = (
    createNativeIIRFilterNode: TNativeIIRFilterNodeFactory,
    createIIRFilterNodeRenderer: TIIRFilterNodeRendererFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TIIRFilterNodeConstructor;
