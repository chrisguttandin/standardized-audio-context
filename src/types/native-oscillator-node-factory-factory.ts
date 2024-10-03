import { TAddSilentConnectionFunction } from './add-silent-connection-function';
import { TCacheTestResultFunction } from './cache-test-result-function';
import { TNativeContext } from './native-context';
import { TNativeOscillatorNodeFactory } from './native-oscillator-node-factory';

export type TNativeOscillatorNodeFactoryFactory = (
    addSilentConnection: TAddSilentConnectionFunction,
    cacheTestResult: TCacheTestResultFunction,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport: (nativeContext: TNativeContext) => boolean,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport: (nativeContext: TNativeContext) => boolean
) => TNativeOscillatorNodeFactory;
