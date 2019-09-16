import { TConnectAudioParamFunction } from './connect-audio-param-function';
import { TGetNativeAudioParamFunction } from './get-native-audio-param-function';
import { TRenderInputsOfAudioParamFunction } from './render-inputs-of-audio-param-function';

export type TConnectAudioParamFactory = (
    getNativeAudioParam: TGetNativeAudioParamFunction,
    renderInputsOfAudioParam: TRenderInputsOfAudioParamFunction
) => TConnectAudioParamFunction;
