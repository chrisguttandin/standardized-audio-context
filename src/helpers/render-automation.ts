import { IAudioParam, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioParam, TNativeOfflineAudioContext } from '../types';
import { getAudioParamRenderer } from './get-audio-param-renderer';
import { renderInputsOfAudioParam } from './render-inputs-of-audio-param';

export const renderAutomation = <T extends IMinimalOfflineAudioContext>(
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: TNativeAudioParam
) => {
    const audioParamRenderer = getAudioParamRenderer<T>(audioParam);

    audioParamRenderer.replay(nativeAudioParam);

    return renderInputsOfAudioParam<T>(audioParam, nativeOfflineAudioContext, nativeAudioParam);
};
