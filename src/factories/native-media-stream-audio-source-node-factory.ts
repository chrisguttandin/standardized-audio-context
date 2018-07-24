import { TNativeMediaStreamAudioSourceNodeFactoryFactory } from '../types';

export const createNativeMediaStreamAudioSourceNodeFactory: TNativeMediaStreamAudioSourceNodeFactoryFactory = (
    createNativeAudioNode
) => {
    return (nativeContext, options) => createNativeAudioNode(nativeContext, (ntvCntxt) => {
        return ntvCntxt.createMediaStreamSource(options.mediaStream);
    });
};
