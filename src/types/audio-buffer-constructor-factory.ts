import { IAudioBufferConstructor, INativeAudioBufferConstructor, INativeOfflineAudioContextConstructor } from '../interfaces';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TAudioBufferConstructorFactory = (
    createNotSupportedError: TNotSupportedErrorFactory,
    nativeAudioBufferConstructor: null | INativeAudioBufferConstructor,
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor,
    testNativeAudioBufferConstructorSupport: () => boolean
) => IAudioBufferConstructor;
