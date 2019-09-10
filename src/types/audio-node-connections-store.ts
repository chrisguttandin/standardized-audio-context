import { IAudioNode, IMinimalBaseAudioContext } from '../interfaces';
import { TAudioNodeConnections } from './audio-node-connections';

export type TAudioNodeConnectionsStore = WeakMap<IAudioNode<IMinimalBaseAudioContext>, TAudioNodeConnections<IMinimalBaseAudioContext>>;
