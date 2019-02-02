import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeConvolverNodeFactory } from './native-convolver-node-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeConvolverNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory
) => TNativeConvolverNodeFactory;
