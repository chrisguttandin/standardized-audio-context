import { TAudioBufferStore } from './audio-buffer-store';
import { TCacheTestResultFunction } from './cache-test-result-function';
import { TNativeAudioBuffer } from './native-audio-buffer';
import { TRenderNativeOfflineAudioContextFunction } from './render-native-offline-audio-context-function';
import { TStartRenderingFunction } from './start-rendering-function';
import { TWrapAudioBufferCopyChannelMethodsFunction } from './wrap-audio-buffer-copy-channel-methods-function';
import { TWrapAudioBufferCopyChannelMethodsOutOfBoundsFunction } from './wrap-audio-buffer-copy-channel-methods-out-of-bounds-function';
import { TWrapAudioBufferCopyChannelMethodsSubarrayFunction } from './wrap-audio-buffer-copy-channel-methods-subarray-function';

export type TStartRenderingFactory = (
    audioBufferStore: TAudioBufferStore,
    cacheTestResult: TCacheTestResultFunction,
    renderNativeOfflineAudioContext: TRenderNativeOfflineAudioContextFunction,
    testAudioBufferCopyChannelMethodsOutOfBoundsSupport: (nativeAudioBuffer: TNativeAudioBuffer) => boolean,
    testAudioBufferCopyChannelMethodsSubarraySupport: (nativeAudioBuffer: TNativeAudioBuffer) => boolean,
    wrapAudioBufferCopyChannelMethods: TWrapAudioBufferCopyChannelMethodsFunction,
    wrapAudioBufferCopyChannelMethodsOutOfBounds: TWrapAudioBufferCopyChannelMethodsOutOfBoundsFunction,
    wrapAudioBufferCopyChannelMethodsSubarray: TWrapAudioBufferCopyChannelMethodsSubarrayFunction
) => TStartRenderingFunction;
