/*
 * Bug #193: Chrome up to version 104 and Safari up to version 15.6 initialized the error property of an ErrorEvent with null.
 */
export const testErrorEventErrorPropertySupport = () => {
    const errorEvent = new ErrorEvent('error');

    return errorEvent.error === undefined;
};
