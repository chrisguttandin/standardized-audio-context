import { TNativeAudioContext, TNativeAudioNode, TNativeOfflineAudioContext } from '../types';

export const isOwnedByContext = (
    nativeNode: TNativeAudioNode, nativeContext: TNativeAudioContext | TNativeOfflineAudioContext
): boolean => {
    // @todo The type definition of TypeScript wrongly defines the context property of an AudioNode as an AudioContext.
    // @todo https://github.com/Microsoft/TypeScript/blob/master/lib/lib.dom.d.ts#L1415
    return ((<any> nativeNode).context === nativeContext);
};
