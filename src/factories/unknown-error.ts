import { TUnknownErrorFactory } from '../types';

export const createUnknownError: TUnknownErrorFactory = () => {
    try {
        return new DOMException('', 'UnknownError');
    } catch (err) {
        // Bug #122: Edge is the only browser that does not yet allow to construct a DOMException.
        err.name = 'UnknownError';

        return err;
    }
};
