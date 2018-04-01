import { IAudioBufferConstructor, IUnpatchedOfflineAudioContextConstructor } from '../interfaces';

export type TAudioBufferConstructorFactory = (
    unpatchedOfflineAudioContextConstructor: null | IUnpatchedOfflineAudioContextConstructor
) => IAudioBufferConstructor;
