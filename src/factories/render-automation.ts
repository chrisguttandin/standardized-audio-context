import { TRenderAutomationFactory } from '../types';

export const createRenderAutomation: TRenderAutomationFactory = (getAudioParamRenderer, renderInputsOfAudioParam) => {
    return (nativeOfflineAudioContext, audioParam, nativeAudioParam, trace) => {
        const audioParamRenderer = getAudioParamRenderer(audioParam);

        audioParamRenderer.replay(nativeAudioParam);

        return renderInputsOfAudioParam(audioParam, nativeOfflineAudioContext, nativeAudioParam, trace);
    };
};
