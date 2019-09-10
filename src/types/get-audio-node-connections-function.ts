import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { TAudioNodeConnections } from './audio-node-connections';

export type TGetAudioNodeConnectionsFunction = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>) => TAudioNodeConnections<T>;
