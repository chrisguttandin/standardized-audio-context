import { TInvalidAccessErrorFactory } from '../types';

export const createInvalidAccessError: TInvalidAccessErrorFactory = () => {
    try {
        return new DOMException('', 'InvalidAccessError');
    } catch (err) {
        err.code = 15;
        err.name = 'InvalidAccessError';

        return err;
    }
};
