import { TConvolverNodeConstructor } from './convolver-node-constructor';
import { TConvolverNodeRendererFactory } from './convolver-node-renderer-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeConvolverNodeFactory } from './native-convolver-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TConvolverNodeConstructorFactory = (
    createConvolverNodeRenderer: TConvolverNodeRendererFactory,
    createNativeConvolverNode: TNativeConvolverNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TConvolverNodeConstructor;
