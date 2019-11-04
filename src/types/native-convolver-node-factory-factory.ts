import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeConvolverNodeFactory } from './native-convolver-node-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';
import { TOverwriteAccessorsFunction } from './overwrite-accessors-function';

export type TNativeConvolverNodeFactoryFactory = (
    createNativeAudioNode: TNativeAudioNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    overwriteAccessors: TOverwriteAccessorsFunction
) => TNativeConvolverNodeFactory;
