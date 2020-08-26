/*
 * Bug #122: Edge up to version v18 did not allow to construct a DOMException'. It also had a couple more bugs but since this is easy to
 * test it's used here as a placeholder.
 *
 * Bug #27: Edge up to version v18 did reject an invalid arrayBuffer passed to decodeAudioData() with a DOMException.
 *
 * Bug #64: Edge up to version v18 did not support the MediaStreamAudioDestinationNode.
 *
 * Bug #93: Edge up to version v18 did set the sampleRate of an AudioContext to zero when it was closed.
 *
 * Bug #101: Edge up to version v18 refused to execute decodeAudioData() on a closed context.
 *
 * Bug #145: Edge up to version v18 did throw an IndexSizeError when an OfflineAudioContext was created with a sampleRate of zero.
 */
export const testDomExceptionConstructorSupport = () => {
    try {
        new DOMException(); // tslint:disable-line:no-unused-expression
    } catch {
        return false;
    }

    return true;
};
