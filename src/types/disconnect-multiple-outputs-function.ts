import { TNativeAudioNode } from './native-audio-node';
import { TNativeAudioParam } from './native-audio-param';

export type TDisconnectMultipleOutputsFunction = (
    outputAudioNodes: TNativeAudioNode[],
    outputOrDestinationAudioNodeOrAudioParam?: number | TNativeAudioNode | TNativeAudioParam,
    output?: number,
    input?: number
) => void | TNativeAudioNode;
