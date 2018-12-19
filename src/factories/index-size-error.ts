import { TIndexSizeErrorFactory } from '../types';

export const createIndexSizeError: TIndexSizeErrorFactory = () => {
    try {
        return new DOMException('', 'IndexSizeError');
    } catch (err) {
        err.code = 1;
        err.name = 'IndexSizeError';

        return err;
    }
};
