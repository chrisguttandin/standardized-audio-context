import { TAudioBufferStore } from './audio-buffer-store';
import { TDataCloneErrorFactory } from './data-clone-error-factory';
import { TDecodeAudioDataFunction } from './decode-audio-data-function';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeContextFunction } from './is-native-context-function';

export type TDecodeAudioDataFactory = (
    audioBufferStore: TAudioBufferStore,
    createDataCloneError: TDataCloneErrorFactory,
    detachedArrayBuffers: WeakSet<ArrayBuffer>,
    getNativeContext: TGetNativeContextFunction,
    isNativeContext: TIsNativeContextFunction
) => TDecodeAudioDataFunction;
