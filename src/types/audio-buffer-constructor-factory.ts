import { IAudioBufferConstructor, INativeOfflineAudioContextConstructor } from '../interfaces';

export type TAudioBufferConstructorFactory = (
    nativeOfflineAudioContextConstructor: null | INativeOfflineAudioContextConstructor
) => IAudioBufferConstructor;
