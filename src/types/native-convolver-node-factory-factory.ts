import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeConvolverNodeFactory } from './native-convolver-node-factory';
import { TNativeConvolverNodeFakerFactory } from './native-convolver-node-faker-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';
import { TOverwriteAccessorsFunction } from './overwrite-accessors-function';

export type TNativeConvolverNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNativeConvolverNodeFaker: TNativeConvolverNodeFakerFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    overwriteAccessors: TOverwriteAccessorsFunction
) => TNativeConvolverNodeFactory;
