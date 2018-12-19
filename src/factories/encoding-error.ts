import { TEncodingErrorFactory } from '../types';

export const createEncodingError: TEncodingErrorFactory = () => {
    try {
        return new DOMException('', 'EncodingError');
    } catch (err) {
        err.code = 0;
        err.name = 'EncodingError';

        return err;
    }
};
