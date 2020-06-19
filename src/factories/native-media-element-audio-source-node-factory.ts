import { TNativeMediaElementAudioSourceNodeFactoryFactory } from '../types';

export const createNativeMediaElementAudioSourceNodeFactory: TNativeMediaElementAudioSourceNodeFactoryFactory = (createNativeAudioNode) => {
    return (nativeAudioContext, options) =>
        createNativeAudioNode(nativeAudioContext, (ntvDCntxt) => {
            return ntvDCntxt.createMediaElementSource(options.mediaElement);
        });
};
