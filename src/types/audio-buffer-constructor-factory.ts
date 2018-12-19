import { TAudioBufferConstructor } from './audio-buffer-constructor';
import { TNativeAudioBufferConstructor } from './native-audio-buffer-constructor';
import { TNativeOfflineAudioContextConstructor } from './native-offline-audio-context-constructor';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TAudioBufferConstructorFactory = (
    createNotSupportedError: TNotSupportedErrorFactory,
    nativeAudioBufferConstructor: null | TNativeAudioBufferConstructor,
    nativeOfflineAudioContextConstructor: null | TNativeOfflineAudioContextConstructor,
    testNativeAudioBufferConstructorSupport: () => boolean
) => TAudioBufferConstructor;
