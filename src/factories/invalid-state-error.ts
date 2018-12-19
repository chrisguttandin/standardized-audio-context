import { TInvalidStateErrorFactory } from '../types';

export const createInvalidStateError: TInvalidStateErrorFactory = () => {
    try {
        return new DOMException('', 'InvalidStateError');
    } catch (err) {
        err.code = 11;
        err.name = 'InvalidStateError';

        return err;
    }
};
