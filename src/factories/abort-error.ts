import { TAbortErrorFactory } from '../types';

export const createAbortError: TAbortErrorFactory = () => {
    try {
        return new DOMException('', 'AbortError');
    } catch (err) {
        // Bug #122: Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 20;
        err.name = 'AbortError';

        return err;
    }
};
