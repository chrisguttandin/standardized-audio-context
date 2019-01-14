import { TEncodingErrorFactory } from '../types';

export const createEncodingError: TEncodingErrorFactory = () => {
    try {
        return new DOMException('', 'EncodingError');
    } catch (err) {
        // Bug #122: Edge is the only browser that does not yet allow to construct a DOMException.
        err.code = 0;
        err.name = 'EncodingError';

        return err;
    }
};
