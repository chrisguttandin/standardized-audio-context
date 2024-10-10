import { TAddSilentConnectionFunction } from './add-silent-connection-function';
import { TCacheTestResultFunction } from './cache-test-result-function';
import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';
import { TNativeContext } from './native-context';

export type TNativeAudioBufferSourceNodeFactoryFactory = (
    addSilentConnection: TAddSilentConnectionFunction,
    cacheTestResult: TCacheTestResultFunction,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport: (nativeContext: TNativeContext) => boolean
) => TNativeAudioBufferSourceNodeFactory;
