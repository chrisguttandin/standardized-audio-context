import { TAddSilentConnectionFunction } from './add-silent-connection-function';
import { TCacheTestResultFunction } from './cache-test-result-function';
import { TNativeAudioBufferSourceNodeFactory } from './native-audio-buffer-source-node-factory';
import { TNativeContext } from './native-context';
import { TWrapAudioBufferSourceNodeStartMethodOffsetClampingFunction } from './wrap-audio-buffer-source-node-start-method-offset-clamping-function';

export type TNativeAudioBufferSourceNodeFactoryFactory = (
    addSilentConnection: TAddSilentConnectionFunction,
    cacheTestResult: TCacheTestResultFunction,
    testAudioBufferSourceNodeStartMethodOffsetClampingSupport: (nativeContext: TNativeContext) => boolean,
    testAudioScheduledSourceNodeStartMethodNegativeParametersSupport: (nativeContext: TNativeContext) => boolean,
    testAudioScheduledSourceNodeStopMethodNegativeParametersSupport: (nativeContext: TNativeContext) => boolean,
    wrapAudioBufferSourceNodeStartMethodOffsetClampling: TWrapAudioBufferSourceNodeStartMethodOffsetClampingFunction
) => TNativeAudioBufferSourceNodeFactory;
