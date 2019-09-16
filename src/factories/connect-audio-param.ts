import { TConnectAudioParamFactory } from '../types';

export const createConnectAudioParam: TConnectAudioParamFactory = (getNativeAudioParam, renderInputsOfAudioParam) => {
    return (
        nativeOfflineAudioContext,
        audioParam,
        nativeAudioParam = getNativeAudioParam(audioParam)
    ) => {
        return renderInputsOfAudioParam(audioParam, nativeOfflineAudioContext, nativeAudioParam);
    };
};
