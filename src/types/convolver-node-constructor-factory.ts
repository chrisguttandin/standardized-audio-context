import { IConvolverNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TConvolverNodeRendererFactory } from './convolver-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeConvolverNodeFactory } from './native-convolver-node-factory';

export type TConvolverNodeConstructorFactory = (
    createConvolverNodeRenderer: TConvolverNodeRendererFactory,
    createNativeConvolverNode: TNativeConvolverNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IConvolverNodeConstructor;
