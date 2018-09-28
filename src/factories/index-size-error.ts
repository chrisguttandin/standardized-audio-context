import { TIndexSizeErrorFactory } from '../types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export const createIndexSizeError: TIndexSizeErrorFactory = () => {
    try {
        return new DOMException('', 'IndexSizeError');
    } catch (err) {
        err.code = 1;
        err.name = 'IndexSizeError';

        return err;
    }
};
