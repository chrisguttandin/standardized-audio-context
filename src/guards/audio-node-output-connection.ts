import { IMinimalBaseAudioContext } from '../interfaces';
import { TAudioNodeOutputConnection, TOutputConnection } from '../types';
import { isAudioNode } from './audio-node';

export const isAudioNodeOutputConnection = <T extends IMinimalBaseAudioContext>(
    outputConnection: TOutputConnection<T>
): outputConnection is TAudioNodeOutputConnection<T> => {
    return isAudioNode(outputConnection[0]);
};
