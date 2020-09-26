import { TAddConnectionToAudioNodeFunction } from './add-connection-to-audio-node-function';
import { TGetAudioNodeTailTimeFunction } from './get-audio-node-tail-time-function';

export type TAddConnectionToAudioNodeFactory = (getAudioNodeTailTime: TGetAudioNodeTailTimeFunction) => TAddConnectionToAudioNodeFunction;
