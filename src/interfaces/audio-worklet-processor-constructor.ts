import { IAudioParamDescriptor } from './audio-param-descriptor';
import { IAudioWorkletProcessor } from './audio-worklet-processor';

export interface IAudioWorkletProcessorConstructor {

    parameterDescriptors: IAudioParamDescriptor[];

    new (): IAudioWorkletProcessor;

}
