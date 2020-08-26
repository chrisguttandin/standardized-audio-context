// Bug #122: Edge up to version v18 did not allow to construct a DOMException'.
export const testDomExceptionConstructorSupport = () => {
    try {
        new DOMException(); // tslint:disable-line:no-unused-expression
    } catch {
        return false;
    }

    return true;
};
