import { TNotSupportedErrorFactory } from '../types';

export const createNotSupportedError: TNotSupportedErrorFactory = () => {
    try {
        return new DOMException('', 'NotSupportedError');
    } catch (err) {
        // Bug #122: Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 9;
        err.name = 'NotSupportedError';

        return err;
    }
};
