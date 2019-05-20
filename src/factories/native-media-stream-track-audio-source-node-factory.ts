import { TNativeMediaStreamTrackAudioSourceNodeFactoryFactory } from '../types';

export const createNativeMediaStreamTrackAudioSourceNodeFactory: TNativeMediaStreamTrackAudioSourceNodeFactoryFactory = (
    createInvalidStateError,
    createNativeAudioNode
) => {
    return (nativeAudioContext, { mediaStreamTrack }) => {
        if (typeof nativeAudioContext.createMediaStreamTrackSource === 'function') {
            return createNativeAudioNode(nativeAudioContext, (ntvDCntxt) => ntvDCntxt.createMediaStreamTrackSource(mediaStreamTrack));
        }

        // Bug #121: Only Firefox Developer does yet support the MediaStreamTrackAudioSourceNode.
        return createNativeAudioNode(nativeAudioContext, (ntvDCntxt) => {
            const mediaStream = new MediaStream([ mediaStreamTrack ]);
            const nativeMediaStreamAudioSourceNode = ntvDCntxt.createMediaStreamSource(mediaStream);

            // Bug #120: Firefox does not throw an error if the mediaStream has no audio track.
            if (mediaStreamTrack.kind !== 'audio') {
                throw createInvalidStateError();
            }

            return nativeMediaStreamAudioSourceNode;
        });
    };
};
