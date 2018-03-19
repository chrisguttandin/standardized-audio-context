import { INativeAudioNodeFaker } from './native-audio-node-faker';
import { INativeConstantSourceNode } from './native-constant-source-node';

export interface INativeConstantSourceNodeFaker extends INativeAudioNodeFaker, INativeConstantSourceNode {

    bufferSize: undefined;

    input: undefined;

}
