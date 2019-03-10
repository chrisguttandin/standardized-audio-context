import { TNativeMediaStreamAudioSourceNodeFactoryFactory } from '../types';

export const createNativeMediaStreamAudioSourceNodeFactory: TNativeMediaStreamAudioSourceNodeFactoryFactory = (
    createInvalidStateError,
    createNativeAudioNode
) => {
    return (nativeAudioContext, { mediaStream }) => {
        const nativeMediaElementAudioSourceNode = createNativeAudioNode(nativeAudioContext, (ntvDCntxt) => {
            /*
             * Bug #63: Edge & Firefox do not expose the mediaStream yet. This bug gets used here to know if the following bug needs to be
             * handled.
             * Bug #151: Firefox does not use the audio track as input anymore if it gets removed from the mediaStream after construction.
             */
            return ntvDCntxt.createMediaStreamSource(
                // @todo This is using a global object without any previous checks.
                ('mediaStream' in MediaStreamAudioSourceNode.prototype)
                    ? mediaStream
                    : mediaStream.clone()
            );
        });

        // Bug #120: Firefox does not throw an error if the mediaStream has no audio track.
        const audioTracks = mediaStream.getAudioTracks();

        if (audioTracks.length === 0) {
            throw createInvalidStateError();
        }

        return nativeMediaElementAudioSourceNode;
    };
};
