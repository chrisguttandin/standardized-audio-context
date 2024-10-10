import { TAddSilentConnectionFunction } from './add-silent-connection-function';
import { TCacheTestResultFunction } from './cache-test-result-function';
import { TNativeConstantSourceNodeFactory } from './native-constant-source-node-factory';
import { TNativeContext } from './native-context';

export type TNativeConstantSourceNodeFactoryFactory = (
    addSilentConnection: TAddSilentConnectionFunction,
    cacheTestResult: TCacheTestResultFunction,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport: (nativeContext: TNativeContext) => boolean
) => TNativeConstantSourceNodeFactory;
