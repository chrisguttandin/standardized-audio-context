import { IMinimalBaseAudioContext } from '../interfaces';
import { TAudioNodeOutputConnection } from './audio-node-output-connection';
import { TAudioParamOutputConnection } from './audio-param-output-connection';

export type TOutputConnection<T extends IMinimalBaseAudioContext> = TAudioNodeOutputConnection<T> | TAudioParamOutputConnection;
