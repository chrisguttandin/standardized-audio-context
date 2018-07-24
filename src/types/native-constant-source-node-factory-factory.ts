import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';
import { TNativeConstantSourceNodeFakerFactory } from './native-constant-source-node-faker-factory';
import { TNativeContext } from './native-context';
import { TWrapConstantSourceNodeAccurateSchedulingFunction } from './wrap-constant-source-node-accurate-scheduling-function';

export type TNativeConstantSourceNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativeConstantSourceNodeFaker: TNativeConstantSourceNodeFakerFactory,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport: (nativeContext: TNativeContext) => boolean,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport: (nativeContext: TNativeContext) => boolean,
    testConstantSourceNodeAccurateSchedulingSupport: (nativeContext: TNativeContext) => boolean,
    wrapConstantSourceNodeAccurateScheduling: TWrapConstantSourceNodeAccurateSchedulingFunction
) => TNativeConstantSourceNodeFactory;
