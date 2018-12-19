import { TNotSupportedErrorFactory } from '../types';

export const createNotSupportedError: TNotSupportedErrorFactory = () => {
    try {
        return new DOMException('', 'NotSupportedError');
    } catch (err) {
        err.code = 9;
        err.name = 'NotSupportedError';

        return err;
    }
};
