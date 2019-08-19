import { IAudioNode, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';

export type TDetectCyclesFunction = <T extends IMinimalBaseAudioContext>(
    source: IAudioNode<T>,
    destination: IAudioNode<T> | IAudioParam
) => boolean;
