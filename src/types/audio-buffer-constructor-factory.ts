import { TAudioBufferConstructor } from './audio-buffer-constructor';
import { TCacheTestResultFunction } from './cache-test-result-function';
import { TNativeAudioBufferConstructor } from './native-audio-buffer-constructor';
import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';
import { TWrapAudioBufferCopyChannelMethodsFunction } from './wrap-audio-buffer-copy-channel-methods-function';
import { TWrapAudioBufferCopyChannelMethodsOutOfBoundsFunction } from './wrap-audio-buffer-copy-channel-methods-out-of-bounds-function';
import { TWrapAudioBufferCopyChannelMethodsSubarrayFunction } from './wrap-audio-buffer-copy-channel-methods-subarray-function';

export type TAudioBufferConstructorFactory = (
    cacheTestResult: TCacheTestResultFunction,
    createNotSupportedError: TNotSupportedErrorFactory,
    nativeAudioBufferConstructor: null | TNativeAudioBufferConstructor,
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor,
    testNativeAudioBufferConstructorSupport: () => boolean,
    wrapAudioBufferCopyChannelMethods: TWrapAudioBufferCopyChannelMethodsFunction,
    wrapAudioBufferCopyChannelMethodsOutOfBounds: TWrapAudioBufferCopyChannelMethodsOutOfBoundsFunction,
    wrapAudioBufferCopyChannelMethodsSubarray: TWrapAudioBufferCopyChannelMethodsSubarrayFunction
) => TAudioBufferConstructor;
