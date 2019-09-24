import { IAudioNode, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';

export type TDetectCyclesFunction = <T extends IMinimalBaseAudioContext>(
    chain: IAudioNode<T>[],
    nextLink: IAudioNode<T> | IAudioParam
) => IAudioNode<T>[][];
