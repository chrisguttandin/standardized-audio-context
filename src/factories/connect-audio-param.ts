import { TConnectAudioParamFactory } from '../types';

export const createConnectAudioParam: TConnectAudioParamFactory = (renderInputsOfAudioParam) => {
    return (nativeOfflineAudioContext, audioParam, nativeAudioParam, trace) => {
        return renderInputsOfAudioParam(audioParam, nativeOfflineAudioContext, nativeAudioParam, trace);
    };
};
