import { TAudioBufferConstructor } from './audio-buffer-constructor';
import { TAudioBufferStore } from './audio-buffer-store';
import { TCacheTestResultFunction } from './cache-test-result-function';
import { TNativeAudioBufferConstructor } from './native-audio-buffer-constructor';
import { TWrapAudioBufferCopyChannelMethodsFunction } from './wrap-audio-buffer-copy-channel-methods-function';
import { TWrapAudioBufferCopyChannelMethodsOutOfBoundsFunction } from './wrap-audio-buffer-copy-channel-methods-out-of-bounds-function';

export type TAudioBufferConstructorFactory = (
    audioBufferStore: TAudioBufferStore,
    cacheTestResult: TCacheTestResultFunction,
    nativeAudioBufferConstructor: null | TNativeAudioBufferConstructor,
    wrapAudioBufferCopyChannelMethods: TWrapAudioBufferCopyChannelMethodsFunction,
    wrapAudioBufferCopyChannelMethodsOutOfBounds: TWrapAudioBufferCopyChannelMethodsOutOfBoundsFunction
) => TAudioBufferConstructor;
