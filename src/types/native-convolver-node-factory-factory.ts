import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeContext } from './native-context';
import { TNativeConvolverNodeFactory } from './native-convolver-node-factory';
import { TNativeConvolverNodeFakerFactory } from './native-convolver-node-faker-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TNativeConvolverNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativeConvolverNodeFaker: TNativeConvolverNodeFakerFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    testConvolverNodeBufferReassignabilitySupport: (nativeContext: TNativeContext) => boolean
) => TNativeConvolverNodeFactory;
