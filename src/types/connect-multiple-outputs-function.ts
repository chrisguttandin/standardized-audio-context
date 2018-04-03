import { TNativeAudioNode } from './native-audio-node';
import { TNativeAudioParam } from './native-audio-param';

export type TConnectMultipleOutputsFunction = (
    outputAudioNodes: TNativeAudioNode[],
    destinationAudioNodeOrAudioParam: TNativeAudioNode | TNativeAudioParam,
    output?: number,
    input?: number
) => void | TNativeAudioNode;
