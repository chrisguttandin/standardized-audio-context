import { TAudioBufferStore } from './audio-buffer-store';
import { TCacheTestResultFunction } from './cache-test-result-function';
import { TDataCloneErrorFactory } from './data-clone-error-factory';
import { TDecodeAudioDataFunction } from './decode-audio-data-function';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeContextFunction } from './is-native-context-function';
import { TNativeAudioBuffer } from './native-audio-buffer';
import { TWrapAudioBufferCopyChannelMethodsOutOfBoundsFunction } from './wrap-audio-buffer-copy-channel-methods-out-of-bounds-function';

export type TDecodeAudioDataFactory = (
    audioBufferStore: TAudioBufferStore,
    cacheTestResult: TCacheTestResultFunction,
    createDataCloneError: TDataCloneErrorFactory,
    detachedArrayBuffers: WeakSet<ArrayBuffer>,
    getNativeContext: TGetNativeContextFunction,
    isNativeContext: TIsNativeContextFunction,
    testAudioBufferCopyChannelMethodsOutOfBoundsSupport: (nativeAudioBuffer: TNativeAudioBuffer) => boolean,
    wrapAudioBufferCopyChannelMethodsOutOfBounds: TWrapAudioBufferCopyChannelMethodsOutOfBoundsFunction
) => TDecodeAudioDataFunction;
