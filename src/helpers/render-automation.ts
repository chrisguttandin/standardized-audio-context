import { IAudioParam, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioParam, TNativeOfflineAudioContext } from '../types';
import { getAudioParamRenderer } from './get-audio-param-renderer';
import { renderInputsOfAudioParam } from './render-inputs-of-audio-param';

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
