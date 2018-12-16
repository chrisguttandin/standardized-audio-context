import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeDynamicsCompressorNodeFactory } from './native-dynamics-compressor-node-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeDynamicsCompressorNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory
) => TNativeDynamicsCompressorNodeFactory;
