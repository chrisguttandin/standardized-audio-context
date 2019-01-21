import { TDataCloneErrorFactory } from './data-clone-error-factory';
import { TDecodeAudioDataFunction } from './decode-audio-data-function';
import { TEncodingErrorFactory } from './encoding-error-factory';
import { TIsNativeContextFunction } from './is-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioBuffer } from './native-audio-buffer';
import { TNativeContext } from './native-context';
import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';

export type TDecodeAudioDataFactory = (
    createDataCloneError: TDataCloneErrorFactory,
    createEncodingError: TEncodingErrorFactory,
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor,
    isNativeContext: TIsNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    testAudioBufferCopyChannelMethodsSubarraySupport: (nativeAudioBuffer: TNativeAudioBuffer) => boolean,
    testPromiseSupport: (nativeContext: TNativeContext) => boolean
) => TDecodeAudioDataFunction;
