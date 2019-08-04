import { TDataCloneErrorFactory } from './data-clone-error-factory';
import { TDecodeAudioDataFunction } from './decode-audio-data-function';
import { TEncodingErrorFactory } from './encoding-error-factory';
import { TIsNativeContextFunction } from './is-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioBuffer } from './native-audio-buffer';
import { TNativeContext } from './native-context';
import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';
import { TWrapAudioBufferCopyChannelMethodsFunction } from './wrap-audio-buffer-copy-channel-methods-function';
import { TWrapAudioBufferCopyChannelMethodsOutOfBoundsFunction } from './wrap-audio-buffer-copy-channel-methods-out-of-bounds-function';
import { TWrapAudioBufferCopyChannelMethodsSubArrayFunction } from './wrap-audio-buffer-copy-channel-methods-subarray-function';

export type TDecodeAudioDataFactory = (
    createDataCloneError: TDataCloneErrorFactory,
    createEncodingError: TEncodingErrorFactory,
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor,
    isNativeContext: TIsNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    testAudioBufferCopyChannelMethodsOutOfBoundsSupport: (nativeAudioBuffer: TNativeAudioBuffer) => boolean,
    testAudioBufferCopyChannelMethodsSubarraySupport: (nativeAudioBuffer: TNativeAudioBuffer) => boolean,
    testPromiseSupport: (nativeContext: TNativeContext) => boolean,
    wrapAudioBufferCopyChannelMethods: TWrapAudioBufferCopyChannelMethodsFunction,
    wrapAudioBufferCopyChannelMethodsOutOfBounds: TWrapAudioBufferCopyChannelMethodsOutOfBoundsFunction,
    wrapAudioBufferCopyChannelMethodsSubArray: TWrapAudioBufferCopyChannelMethodsSubArrayFunction
) => TDecodeAudioDataFunction;
