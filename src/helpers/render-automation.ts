import { getAudioParamRenderer } from '../helpers/get-audio-param-renderer';
import { renderInputsOfAudioParam } from '../helpers/render-inputs-of-audio-param';
import { IAudioParam, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioParam, TNativeOfflineAudioContext } from '../types';

export const renderAutomation = <T extends IMinimalOfflineAudioContext>(
    context: T,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: TNativeAudioParam
) => {
    const audioParamRenderer = getAudioParamRenderer(context, audioParam);

    audioParamRenderer.replay(nativeAudioParam);

    return renderInputsOfAudioParam(context, audioParam, nativeOfflineAudioContext, nativeAudioParam);
};
