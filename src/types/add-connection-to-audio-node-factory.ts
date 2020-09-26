import { TAddActiveInputConnectionToAudioNodeFunction } from './add-active-input-connection-to-audio-node-function';
import { TAddConnectionToAudioNodeFunction } from './add-connection-to-audio-node-function';
import { TGetAudioNodeTailTimeFunction } from './get-audio-node-tail-time-function';

export type TAddConnectionToAudioNodeFactory = (
    addActiveInputConnectionToAudioNode: TAddActiveInputConnectionToAudioNodeFunction,
    getAudioNodeTailTime: TGetAudioNodeTailTimeFunction
) => TAddConnectionToAudioNodeFunction;
