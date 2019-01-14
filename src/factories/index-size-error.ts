import { TIndexSizeErrorFactory } from '../types';

export const createIndexSizeError: TIndexSizeErrorFactory = () => {
    try {
        return new DOMException('', 'IndexSizeError');
    } catch (err) {
        // Bug #122: Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 1;
        err.name = 'IndexSizeError';

        return err;
    }
};
