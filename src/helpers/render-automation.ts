import { getAudioParamRenderer } from '../helpers/get-audio-param-renderer';
import { renderInputsOfAudioParam } from '../helpers/render-inputs-of-audio-param';
import { IAudioParam } from '../interfaces';
import { TContext, TNativeAudioParam, TNativeOfflineAudioContext } from '../types';

export const renderAutomation = (
    context: TContext,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: TNativeAudioParam
) => {
    const audioParamRenderer = getAudioParamRenderer(context, audioParam);

    audioParamRenderer.replay(nativeAudioParam);

    return renderInputsOfAudioParam(context, audioParam, nativeOfflineAudioContext, nativeAudioParam);
};
