import { INativeOfflineAudioContextConstructor } from '../interfaces';
import { TDataCloneErrorFactory } from './data-clone-error-factory';
import { TDecodeAudioDataFunction } from './decode-audio-data-function';
import { TEncodingErrorFactory } from './encoding-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioBuffer } from './native-audio-buffer';
import { TNativeContext } from './native-context';

export type TDecodeAudioDataFactory = (
    createDataCloneError: TDataCloneErrorFactory,
    createEncodingError: TEncodingErrorFactory,
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    testAudioBufferCopyChannelMethodsSubarraySupport: (nativeAudioBuffer: TNativeAudioBuffer) => boolean,
    testPromiseSupport: (nativeContext: TNativeContext) => boolean
) => TDecodeAudioDataFunction;
