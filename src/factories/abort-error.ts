import { TAbortErrorFactory } from '../types';

export const createAbortError: TAbortErrorFactory = () => {
    try {
        return new DOMException('', 'AbortError');
    } catch (err) {
        err.code = 20;
        err.name = 'AbortError';

        return err;
    }
};
