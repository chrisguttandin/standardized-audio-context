import { TEncodingErrorFactory } from '../types';

// @todo Remove this declaration again if TypeScript supports the DOMException constructor.
declare const DOMException: {
    new (message: string, name: string): DOMException;
};

export const createEncodingError: TEncodingErrorFactory = () => {
    try {
        return new DOMException('', 'EncodingError');
    } catch (err) {
        err.code = 0;
        err.name = 'EncodingError';

        return err;
    }
};
