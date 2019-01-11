import { TNativeMediaStreamAudioSourceNodeFactoryFactory } from '../types';

export const createNativeMediaStreamAudioSourceNodeFactory: TNativeMediaStreamAudioSourceNodeFactoryFactory = (
    createInvalidStateError,
    createNativeAudioNode
) => {
    return (nativeAudioContext, { mediaStream }) => {
        const nativeMediaElementAudioSourceNode = createNativeAudioNode(nativeAudioContext, (ntvDCntxt) => {
            return ntvDCntxt.createMediaStreamSource(mediaStream);
        });

        // Bug #120: Firefox does not throw an error if the mediaStream has no audio track.
        const audioTracks = mediaStream.getAudioTracks();

        if (audioTracks.length === 0) {
            throw createInvalidStateError();
        }

        return nativeMediaElementAudioSourceNode;
    };
};
