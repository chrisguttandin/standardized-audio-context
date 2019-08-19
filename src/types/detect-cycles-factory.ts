import { IAudioNode, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TDetectCyclesFunction } from './detect-cycles-function';
import { TGetAudioNodeConnectionsFunction } from './get-audio-node-connections-function';
import { TGetValueForKeyFunction } from './get-value-for-key-function';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TDetectCyclesFactory = (
    audioParamAudioNodeStore: WeakMap<IAudioParam, IAudioNode<IMinimalBaseAudioContext>>,
    createNotSupportedError: TNotSupportedErrorFactory,
    getAudioNodeConnections: TGetAudioNodeConnectionsFunction,
    getValueForKey: TGetValueForKeyFunction
) => TDetectCyclesFunction;
