import { IAudioNode, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TDetectCyclesFunction } from './detect-cycles-function';
import { TGetAudioNodeConnectionsFunction } from './get-audio-node-connections-function';
import { TGetValueForKeyFunction } from './get-value-for-key-function';

export type TDetectCyclesFactory = (
    audioParamAudioNodeStore: WeakMap<IAudioParam, IAudioNode<IMinimalBaseAudioContext>>,
    getAudioNodeConnections: TGetAudioNodeConnectionsFunction,
    getValueForKey: TGetValueForKeyFunction
) => TDetectCyclesFunction;
