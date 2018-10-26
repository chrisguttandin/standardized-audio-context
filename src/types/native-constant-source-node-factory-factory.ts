import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';
import { TNativeConstantSourceNodeFakerFactory } from './native-constant-source-node-faker-factory';
import { TNativeContext } from './native-context';

export type TNativeConstantSourceNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativeConstantSourceNodeFaker: TNativeConstantSourceNodeFakerFactory,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport: (nativeContext: TNativeContext) => boolean,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport: (nativeContext: TNativeContext) => boolean
) => TNativeConstantSourceNodeFactory;
