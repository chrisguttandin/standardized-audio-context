import { IAudioNode, IAudioNodeConnections, IMinimalBaseAudioContext } from '../interfaces';

export type TAudioNodeConnectionsStore = WeakMap<
    IAudioNode<IMinimalBaseAudioContext>,
    Readonly<IAudioNodeConnections<IMinimalBaseAudioContext>>
>;
