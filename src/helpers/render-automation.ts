import { getAudioParamRenderer } from '../helpers/get-audio-param-renderer';
import { renderInputsOfAudioParam } from '../helpers/render-inputs-of-audio-param';
import { IAudioParam } from '../interfaces';
import { TNativeAudioParam, TNativeOfflineAudioContext, TStandardizedContext } from '../types';

export const renderAutomation = (
    context: TStandardizedContext,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: TNativeAudioParam
) => {
    const audioParamRenderer = getAudioParamRenderer(context, audioParam);

    audioParamRenderer.replay(nativeAudioParam);

    return renderInputsOfAudioParam(context, audioParam, nativeOfflineAudioContext, nativeAudioParam);
};
