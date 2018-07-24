import { TNativeMediaElementAudioSourceNodeFactoryFactory } from '../types';

export const createNativeMediaElementAudioSourceNodeFactory: TNativeMediaElementAudioSourceNodeFactoryFactory = (
    createNativeAudioNode
) => {
    return (nativeContext, options) => createNativeAudioNode(nativeContext, (ntvCntxt) => {
        return ntvCntxt.createMediaElementSource(options.mediaElement);
    });
};
