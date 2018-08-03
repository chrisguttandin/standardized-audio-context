import { TNativeMediaStreamAudioSourceNodeFactoryFactory } from '../types';

export const createNativeMediaStreamAudioSourceNodeFactory: TNativeMediaStreamAudioSourceNodeFactoryFactory = (
    createNativeAudioNode
) => {
    return (nativeAudioContext, options) => createNativeAudioNode(nativeAudioContext, (ntvDCntxt) => {
        return ntvDCntxt.createMediaStreamSource(options.mediaStream);
    });
};
