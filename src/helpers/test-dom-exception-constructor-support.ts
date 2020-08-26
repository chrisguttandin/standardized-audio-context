/*
 * Bug #122: Edge up to version v18 did not allow to construct a DOMException'. It also had a couple more bugs but since this is easy to
 * test it's used here as a placeholder.
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
