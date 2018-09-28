import { TAbortErrorFactory } from '../types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export const createAbortError: TAbortErrorFactory = () => {
    try {
        return new DOMException('', 'AbortError');
    } catch (err) {
        err.code = 20;
        err.name = 'AbortError';

        return err;
    }
};
