import { TIndexSizeErrorFactory } from '../types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export const createIndexSizeError: TIndexSizeErrorFactory = () => {
    try {
        return new DOMException('', 'IndexSizeError');
    } catch (err) {
        const exception: any = new Error();

        exception.code = 1;
        exception.name = 'IndexSizeError';

        return exception;
    }
};
