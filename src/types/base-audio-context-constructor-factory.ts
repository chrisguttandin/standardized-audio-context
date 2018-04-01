import { IAudioBufferConstructor, IBaseAudioContextConstructor, IMinimalBaseAudioContextConstructor } from '../interfaces';

export type TBaseAudioContextConstructorFactory = (
    audioBufferConstructor: IAudioBufferConstructor,
    minimalBaseAudioContextConstructor: IMinimalBaseAudioContextConstructor
) => IBaseAudioContextConstructor;
